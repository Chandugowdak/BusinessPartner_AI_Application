import { useCallback, useEffect, useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { App, Button, Descriptions, Modal, Table, Tag } from 'antd';
import { getEmailHistory } from '../DataProvider/EmailDataProvider';
import './EmailPages.css';

const statusColor = { sent: 'success', pending: 'processing', failed: 'error' };
const statusLabel = { sent: 'Accepted', pending: 'Pending', failed: 'Failed' };

export default function EmailHistoryPage() {
  const { message } = App.useApp();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const loadHistory = useCallback(async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const response = await getEmailHistory(page, pageSize);
      setEntries(response.entries || []);
      setPagination({ current: response.page, pageSize: response.limit, total: response.total });
    } catch (error) {
      message.error(error.response?.data?.message || 'Email history could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => { loadHistory(1, 20); }, [loadHistory]);

  const columns = [
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', width: 180, render: (value) => new Date(value).toLocaleString() },
    { title: 'Recipient', dataIndex: 'recipient', key: 'recipient', ellipsis: true },
    { title: 'Subject', dataIndex: 'subject', key: 'subject', ellipsis: true },
    { title: 'Template', dataIndex: 'templateName', key: 'templateName', ellipsis: true },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 110, render: (value) => <Tag color={statusColor[value]}>{statusLabel[value] || value}</Tag> },
    {
      title: 'Details',
      key: 'details',
      width: 140,
      render: (_value, entry) => (
        <Button icon={<EyeOutlined />} onClick={() => setSelectedEntry(entry)}>
          View details
        </Button>
      ),
    },
  ];

  return (
    <main className="email-page">
      <header className="email-page-header">
        <span className="email-eyebrow">EMAIL WORKSPACE</span>
        <h1>Email history</h1>
        <p>Review attempts and whether your mail server accepted them. Inbox delivery is not confirmed. History is private to your account.</p>
      </header>
      <section className="email-history-panel">
        <div className="email-section-heading"><div><span className="email-section-kicker">DELIVERY RECORDS</span><h2>Recent activity</h2></div><span className="email-history-count">{pagination.total} total</span></div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={entries}
          loading={loading}
          pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: [10, 20, 50] }}
          onChange={(nextPagination) => loadHistory(nextPagination.current, nextPagination.pageSize)}
          locale={{ emptyText: 'No email delivery attempts yet.' }}
          scroll={{ x: 900 }}
        />
      </section>
      <Modal
        title="Email delivery details"
        open={Boolean(selectedEntry)}
        onCancel={() => setSelectedEntry(null)}
        footer={<Button onClick={() => setSelectedEntry(null)}>Close</Button>}
        destroyOnClose
      >
        {selectedEntry && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Status">
              <Tag color={statusColor[selectedEntry.status]}>{statusLabel[selectedEntry.status] || selectedEntry.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Sender">{selectedEntry.sender || 'Not recorded'}</Descriptions.Item>
            <Descriptions.Item label="Recipient">{selectedEntry.recipient}</Descriptions.Item>
            <Descriptions.Item label="Subject">{selectedEntry.subject}</Descriptions.Item>
            <Descriptions.Item label={selectedEntry.status === 'failed' ? 'Failure reason' : 'Message'}>
              {selectedEntry.status === 'failed'
                ? selectedEntry.failureReason || 'Failure details were not recorded for this email.'
                : selectedEntry.status === 'sent'
                  ? selectedEntry.successMessage || 'Email sent successfully.'
                  : 'Delivery is still processing.'}
            </Descriptions.Item>
            {selectedEntry.previewUrl && (
              <Descriptions.Item label="Test email preview">
                <a href={selectedEntry.previewUrl} target="_blank" rel="noreferrer">Open Ethereal preview</a>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Date">{new Date(selectedEntry.createdAt).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </main>
  );
}
