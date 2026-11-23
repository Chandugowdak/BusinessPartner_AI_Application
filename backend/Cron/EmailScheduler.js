const cron = require('node-cron');
const EmailSchedule = require('../model/Email/EmailScheduleSchema');
const { sendScheduledTemplate, recordScheduledFailure } = require('../Controller/MailSenderController');

const getNextDailyRun = (time, timezone, after = new Date()) => {
    const [hour, minute] = time.split(':').map(Number);
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
    const nextMinute = new Date(Math.floor(after.getTime() / 60000) * 60000 + 60000);

    for (let offset = 0; offset < 3 * 24 * 60; offset += 1) {
        const candidate = new Date(nextMinute.getTime() + offset * 60000);
        const parts = Object.fromEntries(formatter.formatToParts(candidate).map(({ type, value }) => [type, value]));
        if (Number(parts.hour) === hour && Number(parts.minute) === minute) return candidate;
    }

    throw new Error(`Could not calculate the next run for ${time} in ${timezone}.`);
};

let isRunning = false;

const runDueSchedules = async () => {
    if (isRunning) return;
    isRunning = true;
    try {
        const now = new Date();
        const dueSchedules = await EmailSchedule.find({
            enabled: true,
            nextRunAt: { $lte: now },
        }).sort({ nextRunAt: 1 }).limit(100).lean();

        for (const dueSchedule of dueSchedules) {
            let nextRunAt;
            try {
                nextRunAt = getNextDailyRun(dueSchedule.time, dueSchedule.timezone, now);
            } catch (error) {
                console.error(`Could not calculate next run for email schedule ${dueSchedule._id}:`, error);
                continue;
            }

            const claimedSchedule = await EmailSchedule.findOneAndUpdate(
                { _id: dueSchedule._id, enabled: true, nextRunAt: { $lte: now } },
                { $set: { nextRunAt } },
                { new: true },
            ).lean();
            if (!claimedSchedule) continue;

            let history;
            let runStatus = 'failed';
            let lastError = null;
            try {
                const result = await sendScheduledTemplate(claimedSchedule);
                history = result.history;
                runStatus = result.status === 200 ? 'sent' : 'failed';
                if (runStatus === 'failed') lastError = result.message;
            } catch (error) {
                console.error(`Scheduled email "${claimedSchedule.name}" failed:`, error);
                lastError = error.message || 'Scheduled email could not be sent.';
                try {
                    history = await recordScheduledFailure(claimedSchedule, error);
                } catch (historyError) {
                    console.error(`Scheduled email failure could not be recorded for ${claimedSchedule._id}:`, historyError);
                }
            }

            try {
                await EmailSchedule.updateOne(
                    { _id: claimedSchedule._id },
                    {
                        $set: {
                            lastRunAt: now,
                            lastRunStatus: runStatus,
                            lastError: lastError?.slice(0, 1000) || null,
                            lastHistoryId: history?._id || null,
                        },
                    },
                );
            } catch (error) {
                console.error(`Schedule run status could not be saved for ${claimedSchedule._id}:`, error);
            }
        }
    } catch (error) {
        console.error('Due email schedules could not be loaded:', error);
    } finally {
        isRunning = false;
    }
};

const startEmailScheduler = () => {
    cron.schedule('* * * * *', () => { void runDueSchedules(); });
    void runDueSchedules();
    console.log('Email scheduler started.');
};

module.exports = { getNextDailyRun, startEmailScheduler };
