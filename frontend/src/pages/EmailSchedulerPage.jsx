import { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Alert, Button, Card, Input, Popconfirm, Select, Space, Spin, Switch, Tag } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  createEmailSchedule,
  deleteEmailSchedule,
  getEmailConfiguration,
  getEmailSchedules,
  updateEmailSchedule,
} from '../DataProvider/EmailDataProvider';
import './EmailPages.css';

const emptySchedule = () => ({
  name: '',
  templateId: undefined,
  recipient: '',
  time: '09:00',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  variables: {},
  enabled: true,
});

const findVariables = (template) => [...new Set(
  [...`${template?.subject || ''}\n${template?.content || ''}`.matchAll(/{{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*}}/g)]
    .map((match) => match[1]),
)];

const getSchedulePayload = (schedule) => ({
  name: schedule.name,
  templateId: typeof schedule.template === 'object' ? schedule.template?._id : schedule.template,
  recipient: schedule.recipient,
  time: schedule.time,
  timezone: schedule.timezone,
  variables: schedule.variables || {},
  enabled: schedule.enabled,
});

const formatDate = (date, timezone) => date
  ? new Date(date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short', timeZone: timezone })
  : 'Not scheduled';

export default function EmailSchedulerPage() {
  const { message } = App.useApp();
  const [templates, setTemplates] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [scheduleForm, setScheduleForm] = useState(emptySchedule);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyScheduleId, setBusyScheduleId] = useState(null);
  const selectedTemplate = templates.find((template) => template._id === scheduleForm.templateId);
  const templateVariables = useMemo(() => findVariables(selectedTemplate), [selectedTemplate]);
  const cronExpression = /^([01]\d|2[0-3]):[0-5]\d$/.test(scheduleForm.time)
    ? `${Number(scheduleForm.time.slice(3))} ${Number(scheduleForm.time.slice(0, 2))} * * *`
    : '';

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const [configuration, scheduleResponse] = await Promise.all([getEmailConfiguration(), getEmailSchedules()]);
      setTemplates(configuration.templates || []);
      setSchedules(scheduleResponse.schedules || []);
    } catch (error) {
      message.error(error.response?.data?.message || 'Email schedules could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => { loadSchedules(); }, [loadSchedules]);

  const saveSchedule = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = editingId
        ? await updateEmailSchedule(editingId, scheduleForm)
        : await createEmailSchedule(scheduleForm);
      setSchedules((current) => editingId
        ? current.map((schedule) => schedule._id === editingId ? response.schedule : schedule)
        : [response.schedule, ...current]);
      setScheduleForm(emptySchedule());
      setEditingId(null);
      message.success(editingId ? 'Schedule updated.' : 'Daily email schedule created.');
    } catch (error) {
      message.error(error.response?.data?.message || 'Email schedule could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const editSchedule = (schedule) => {
    setEditingId(schedule._id);
    setScheduleForm(getSchedulePayload(schedule));
  };

  const toggleSchedule = async (schedule, enabled) => {
    setBusyScheduleId(schedule._id);
    try {
      const response = await updateEmailSchedule(schedule._id, { ...getSchedulePayload(schedule), enabled });
      setSchedules((current) => current.map((item) => item._id === schedule._id ? response.schedule : item));
      message.success(enabled ? 'Schedule enabled.' : 'Schedule paused.');
    } catch (error) {
      message.error(error.response?.data?.message || 'Schedule could not be updated.');
    } finally {
      setBusyScheduleId(null);
    }
  };

  const removeSchedule = async (scheduleId) => {
    try {
      await deleteEmailSchedule(scheduleId);
      setSchedules((current) => current.filter((schedule) => schedule._id !== scheduleId));
      if (editingId === scheduleId) {
        setEditingId(null);
        setScheduleForm(emptySchedule());
      }
      message.success('Schedule deleted.');
    } catch (error) {
      message.error(error.response?.data?.message || 'Schedule could not be deleted.');
    }
  };

  return (
    <main className="email-page scheduler-page">
      <header className="email-page-header">
        <span className="email-eyebrow">SYSTEM · AUTOMATION</span>
        <h1>Daily email scheduler</h1>
        <p>Choose a saved message, recipient, and local delivery time. Schedules run every day while enabled, even when you are signed out.</p>
      </header>

      <div className="scheduler-layout">
        <section className="email-section">
          <div className="email-section-heading">
            <div><span className="email-section-kicker">SCHEDULE SETUP</span><h2>{editingId ? 'Edit schedule' : 'Create a schedule'}</h2></div>
            <Tag color="blue"><CalendarOutlined /> Daily</Tag>
          </div>
          <Card className="scheduler-form-card">
            <form className="email-template-form" onSubmit={saveSchedule}>
              <label>Schedule name<Input value={scheduleForm.name} maxLength={80} onChange={(event) => setScheduleForm({ ...scheduleForm, name: event.target.value })} placeholder="e.g. Morning partner update" required /></label>
              <label>Email template
                <Select
                  placeholder="Choose a saved template"
                  value={scheduleForm.templateId}
                  onChange={(templateId) => setScheduleForm({ ...scheduleForm, templateId, variables: {} })}
                  options={templates.map((template) => ({ value: template._id, label: template.name }))}
                  notFoundContent="Create a template in Email configuration first."
                />
              </label>
              <label>Recipient email<Input type="email" autoComplete="email" value={scheduleForm.recipient} onChange={(event) => setScheduleForm({ ...scheduleForm, recipient: event.target.value })} maxLength={254} required /></label>
              {templateVariables.map((variable) => (
                <label key={variable}>{variable}<Input value={scheduleForm.variables[variable] || ''} maxLength={500} onChange={(event) => setScheduleForm({ ...scheduleForm, variables: { ...scheduleForm.variables, [variable]: event.target.value } })} /></label>
              ))}
              <div className="scheduler-time-grid">
                <label>Send time<Input type="time" value={scheduleForm.time} onChange={(event) => setScheduleForm({ ...scheduleForm, time: event.target.value })} required /></label>
                <label>Time zone (IANA)<Input value={scheduleForm.timezone} onChange={(event) => setScheduleForm({ ...scheduleForm, timezone: event.target.value })} placeholder="Asia/Kolkata" maxLength={100} required /></label>
              </div>
              <span className="email-form-hint">The selected time zone is used for every daily run, including daylight-saving changes. Example: Asia/Kolkata.</span>
              <Alert
                type="info"
                showIcon
                message={scheduleForm.time && scheduleForm.timezone
                  ? `Runs daily at ${scheduleForm.time} (${scheduleForm.timezone})`
                  : 'Choose a daily run time and time zone'}
                description={`Cron: ${cronExpression || '—'} · The scheduler runs on the application server. Keep the backend service running for scheduled delivery.`}
              />
              <Space>
                <Button type="primary" htmlType="submit" icon={editingId ? <EditOutlined /> : <PlusOutlined />} loading={saving} disabled={!templates.length}>
                  {editingId ? 'Save changes' : 'Create daily schedule'}
                </Button>
                {editingId && <Button onClick={() => { setEditingId(null); setScheduleForm(emptySchedule()); }}>Cancel</Button>}
              </Space>
            </form>
          </Card>
          {!templates.length && !loading && <Alert className="scheduler-no-templates" type="warning" showIcon message="No email templates yet" description="Create a message template in System → Email configuration before setting up automation." />}
        </section>

        <section className="email-section">
          <div className="email-section-heading">
            <div><span className="email-section-kicker">AUTOMATION RULES</span><h2>Saved schedules</h2></div>
            <Tag>{schedules.length} total</Tag>
          </div>
          {loading ? <div className="email-loading"><Spin size="large" /></div> : (
            <div className="scheduler-list">
              {schedules.map((schedule) => (
                <Card key={schedule._id} className={`scheduler-card${schedule.enabled ? '' : ' paused'}`}>
                  <div className="scheduler-card-top">
                    <div className="scheduler-card-title"><span className="scheduler-clock"><ClockCircleOutlined /></span><div><h3>{schedule.name}</h3><span>{schedule.template?.name || 'Template unavailable'}</span></div></div>
                    <Tag color={schedule.enabled ? 'success' : 'default'}>{schedule.enabled ? 'Active' : 'Paused'}</Tag>
                  </div>
                  <div className="scheduler-card-details">
                    <span><MailOutlined /> {schedule.recipient}</span>
                    <span><ClockCircleOutlined /> {schedule.time} · {schedule.timezone}</span>
                    <span>Cron: {schedule.cronExpression}</span>
                    <span><CalendarOutlined /> Next run: {schedule.enabled ? formatDate(schedule.nextRunAt, schedule.timezone) : 'Paused'}</span>
                    {schedule.lastRunAt && <span>Last run: {formatDate(schedule.lastRunAt, schedule.timezone)} · <Tag color={schedule.lastRunStatus === 'sent' ? 'success' : 'error'}>{schedule.lastRunStatus}</Tag></span>}
                    {schedule.lastError && <Alert type="error" showIcon message={schedule.lastError} />}
                  </div>
                  <div className="scheduler-card-actions">
                    <Switch checked={schedule.enabled} loading={busyScheduleId === schedule._id} onChange={(enabled) => toggleSchedule(schedule, enabled)} checkedChildren={<PlayCircleOutlined />} unCheckedChildren={<PauseCircleOutlined />} aria-label={`${schedule.enabled ? 'Pause' : 'Enable'} ${schedule.name}`} />
                    <Button icon={<EditOutlined />} onClick={() => editSchedule(schedule)}>Edit</Button>
                    <Popconfirm title="Delete this schedule?" description="Future automated emails will no longer be sent." onConfirm={() => removeSchedule(schedule._id)}>
                      <Button danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                  </div>
                </Card>
              ))}
              {!schedules.length && <div className="email-empty-state"><CalendarOutlined /><strong>No schedules yet</strong><span>Create your first daily email schedule.</span></div>}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
