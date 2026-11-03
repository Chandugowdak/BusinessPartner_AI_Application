import { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Alert, Button, Card, Input, Popconfirm, Select, Space, Spin, Tag } from 'antd';
import { CheckCircleOutlined, EditOutlined, MailOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import {
  createEmailTemplate,
  deleteEmailTemplate,
  getEmailConfiguration,
  sendTemplateEmail,
  testEmailConfiguration,
  updateEmailTemplate,
} from '../DataProvider/EmailDataProvider';
import './EmailPages.css';

const emptyTemplate = { name: '', subject: '', content: '' };
const findVariables = (template) => [...new Set(
  [...`${template?.subject || ''}\n${template?.content || ''}`.matchAll(/{{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*}}/g)]
    .map((match) => match[1]),
)];

export default function EmailConfigurationPage() {
  const { message } = App.useApp();
  const [templates, setTemplates] = useState([]);
  const [mailStatus, setMailStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [sending, setSending] = useState(false);
  const [templateForm, setTemplateForm] = useState(emptyTemplate);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [variables, setVariables] = useState({});
  const selectedTemplate = templates.find((template) => template._id === selectedId);
  const templateVariables = useMemo(() => findVariables(selectedTemplate), [selectedTemplate]);

  const loadConfiguration = useCallback(async () => {
    setLoading(true);
    try {
      const configuration = await getEmailConfiguration();
      setTemplates(configuration.templates || []);
      setMailStatus(configuration.mail);
      setSelectedId((current) => configuration.templates.some((template) => template._id === current)
        ? current
        : configuration.templates[0]?._id || null);
    } catch (error) {
      message.error(error.response?.data?.message || 'Email configuration could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => { loadConfiguration(); }, [loadConfiguration]);

  const saveTemplate = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = editingId
        ? await updateEmailTemplate(editingId, templateForm)
        : await createEmailTemplate(templateForm);
      const updatedTemplate = response.template;
      setTemplates((current) => editingId
        ? current.map((template) => template._id === editingId ? updatedTemplate : template)
        : [updatedTemplate, ...current]);
      setSelectedId(updatedTemplate._id);
      setTemplateForm(emptyTemplate);
      setEditingId(null);
      message.success(editingId ? 'Template updated.' : 'Template created.');
    } catch (error) {
      message.error(error.response?.data?.message || 'Template could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const editTemplate = (template) => {
    setEditingId(template._id);
    setTemplateForm({ name: template.name, subject: template.subject, content: template.content });
  };

  const removeTemplate = async (templateId) => {
    try {
      await deleteEmailTemplate(templateId);
      setTemplates((current) => current.filter((template) => template._id !== templateId));
      if (selectedId === templateId) setSelectedId(templates.find((template) => template._id !== templateId)?._id || null);
      if (editingId === templateId) { setEditingId(null); setTemplateForm(emptyTemplate); }
      message.success('Template deleted.');
    } catch (error) {
      message.error(error.response?.data?.message || 'Template could not be deleted.');
    }
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const response = await testEmailConfiguration();
      message.success(response.message);
    } catch (error) {
      message.error(error.response?.data?.message || 'SMTP connection could not be verified.');
    } finally {
      setTesting(false);
    }
  };

  const sendEmail = async (event) => {
    event.preventDefault();
    if (!selectedTemplate) return;
    setSending(true);
    try {
      await sendTemplateEmail({ templateId: selectedId, to: recipient, variables });
      setRecipient('');
      setVariables({});
      message.success('Email sent. See Email history for delivery status.');
    } catch (error) {
      message.error(error.response?.data?.message || 'Email could not be sent.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="email-page">
      <header className="email-page-header">
        <span className="email-eyebrow">EMAIL WORKSPACE</span>
        <h1>Email configuration</h1>
        <p>Manage reusable message templates and send personalized emails. SMTP credentials stay on the server.</p>
      </header>
      {mailStatus && (
        <Alert
          className="email-config-alert"
          type={mailStatus.configured ? 'success' : 'warning'}
          showIcon
          message={mailStatus.configured ? 'Email delivery is configured' : 'Email delivery needs server configuration'}
          description={mailStatus.configured
            ? 'The server has the required SMTP settings.'
            : `Add the missing settings to the backend environment: ${mailStatus.missingFields.join(', ')}.`}
          action={mailStatus.configured && <Button icon={<CheckCircleOutlined />} loading={testing} onClick={testConnection}>Test connection</Button>}
        />
      )}
      {loading ? <div className="email-loading"><Spin size="large" /></div> : (
        <div className="email-config-grid">
          <section className="email-section">
            <div className="email-section-heading"><div><span className="email-section-kicker">YOUR LIBRARY</span><h2>Message templates</h2></div><Tag>{templates.length} saved</Tag></div>
            <div className="email-template-list">
              {templates.map((template) => (
                <Card
                  key={template._id}
                  size="small"
                  className={`email-template-card${selectedId === template._id ? ' selected' : ''}`}
                  onClick={() => { setSelectedId(template._id); setVariables({}); }}
                >
                  <div className="email-template-card-heading">
                    <button className="email-template-select" type="button" onClick={() => { setSelectedId(template._id); setVariables({}); }}>
                      <strong>{template.name}</strong><span>{template.subject}</span>
                    </button>
                    <Space>
                      <Button aria-label={`Edit ${template.name}`} icon={<EditOutlined />} onClick={(event) => { event.stopPropagation(); editTemplate(template); }} />
                      <Popconfirm title="Delete this template?" onConfirm={() => removeTemplate(template._id)}>
                        <Button aria-label={`Delete ${template.name}`} danger onClick={(event) => event.stopPropagation()}>Delete</Button>
                      </Popconfirm>
                    </Space>
                  </div>
                  <p>{template.content}</p>
                </Card>
              ))}
              {!templates.length && <div className="email-empty-state"><MailOutlined /><strong>No templates yet</strong><span>Create a template to get started.</span></div>}
            </div>
            <Card className="email-editor-card">
              <h3>{editingId ? 'Edit template' : 'Create a template'}</h3>
              <form className="email-template-form" onSubmit={saveTemplate}>
                <label>Template name<Input value={templateForm.name} maxLength={80} onChange={(event) => setTemplateForm({ ...templateForm, name: event.target.value })} required /></label>
                <label>Subject<Input value={templateForm.subject} maxLength={200} onChange={(event) => setTemplateForm({ ...templateForm, subject: event.target.value })} required /></label>
                <label>Message body<Input.TextArea value={templateForm.content} maxLength={10000} rows={5} onChange={(event) => setTemplateForm({ ...templateForm, content: event.target.value })} required /></label>
                <span className="email-form-hint">Use placeholders such as {'{{name}}'} or {'{{company}}'}; values are safely escaped.</span>
                <Space>
                  <Button type="primary" htmlType="submit" icon={editingId ? <EditOutlined /> : <PlusOutlined />} loading={saving}>{editingId ? 'Save changes' : 'Save template'}</Button>
                  {editingId && <Button onClick={() => { setEditingId(null); setTemplateForm(emptyTemplate); }}>Cancel</Button>}
                </Space>
              </form>
            </Card>
          </section>

          <section className="email-section">
            <div className="email-section-heading"><div><span className="email-section-kicker">PERSONALIZED OUTREACH</span><h2>Send an email</h2></div></div>
            <Card className="email-send-card">
              <form className="email-template-form" onSubmit={sendEmail}>
                <label>Template<Select placeholder="Choose a template" value={selectedId} onChange={(value) => { setSelectedId(value); setVariables({}); }} options={templates.map((template) => ({ value: template._id, label: template.name }))} /></label>
                <label>Recipient email<Input type="email" autoComplete="email" value={recipient} onChange={(event) => setRecipient(event.target.value)} maxLength={254} required /></label>
                {templateVariables.map((variable) => (
                  <label key={variable}>{variable}<Input value={variables[variable] || ''} maxLength={500} onChange={(event) => setVariables({ ...variables, [variable]: event.target.value })} /></label>
                ))}
                {selectedTemplate && <div className="email-preview"><span>SUBJECT PREVIEW</span><strong>{selectedTemplate.subject.replace(/{{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*}}/g, (_match, key) => variables[key] || `[${key}]`)}</strong><p>{selectedTemplate.content}</p></div>}
                <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={sending} disabled={!selectedTemplate || !mailStatus?.configured}>Send email</Button>
              </form>
            </Card>
            <p className="email-rate-note">Sending is limited to 20 messages per hour per account. Delivery attempts are recorded in history.</p>
          </section>
        </div>
      )}
    </main>
  );
}
