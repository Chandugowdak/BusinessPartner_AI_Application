import { useState } from "react";
import { Button, Input, Tag } from "antd";
import { EnvironmentOutlined, SearchOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import WorkspacePage from "./WorkspacePage";
import "./JobsPage.css";

const jobs = [
  {
    id: "product-lead-northstar",
    title: "Product Lead",
    company: "Northstar Health",
    location: "Remote | North America",
    type: "Full-time",
    category: "Product & Design",
    compensation: "$125k-$155k",
    summary: "Shape a simpler care experience with a small, mission-driven product team.",
  },
  {
    id: "growth-marketer-fieldnote",
    title: "Founding Growth Marketer",
    company: "Fieldnote",
    location: "Hybrid | Toronto, ON",
    type: "Full-time",
    category: "Marketing & Growth",
    compensation: "$95k-$120k + equity",
    summary: "Build the first repeatable growth engine for an early-stage climate-tech company.",
  },
  {
    id: "operations-associate-common-table",
    title: "Operations Associate",
    company: "Common Table",
    location: "On-site | Chicago, IL",
    type: "Full-time",
    category: "Operations",
    compensation: "$70k-$88k",
    summary: "Turn a fast-growing local food network into a dependable, scalable operation.",
  },
  {
    id: "engineering-advisor-open-source",
    title: "Part-time Engineering Advisor",
    company: "Open Source Foundry",
    location: "Remote | Worldwide",
    type: "Part-time",
    category: "Engineering",
    compensation: "$90-$130 / hour",
    summary: "Help two technical founders make sound architecture choices as they find product-market fit.",
  },
];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState([]);
  const query = search.trim().toLowerCase();
  const filteredJobs = jobs.filter((job) => !query || [job.title, job.company, job.location, job.type, job.category].join(" ").toLowerCase().includes(query));

  const toggleSaved = (jobId) => {
    setSavedIds((current) => current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId]);
  };

  return (
    <WorkspacePage eyebrow="OPPORTUNITIES" title="Find your next role" description="Explore opportunities shared by teams building what comes next.">
      <section className="jobs-intro" aria-label="Job search">
        <div>
          <span className="jobs-kicker">A CURATED START</span>
          <h2>Good work, with good people.</h2>
          <p>Browse a few opportunities from growing teams. This board is currently a static preview.</p>
        </div>
        <div className="jobs-count"><strong>{filteredJobs.length}</strong><span>open roles</span></div>
      </section>
      <div className="jobs-toolbar">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} prefix={<SearchOutlined />} placeholder="Search roles, teams, or locations" allowClear aria-label="Search jobs" />
        <span>{savedIds.length} saved</span>
      </div>
      <section className="jobs-list" aria-label="Job listings">
        {filteredJobs.map((job) => {
          const isSaved = savedIds.includes(job.id);
          return (
            <article className="job-listing" key={job.id}>
              <div className="job-listing-top">
                <div className="job-company-mark" aria-hidden="true">{job.company.split(" ").map((word) => word[0]).join("").slice(0, 2)}</div>
                <div className="job-listing-heading"><span>{job.company}</span><h2>{job.title}</h2></div>
                <Button className="job-save-button" type="text" aria-label={isSaved ? `Unsave ${job.title}` : `Save ${job.title}`} title={isSaved ? "Unsave job" : "Save job"} icon={isSaved ? <StarFilled /> : <StarOutlined />} onClick={() => toggleSaved(job.id)} />
              </div>
              <p className="job-summary">{job.summary}</p>
              <div className="job-listing-footer">
                <div className="job-details"><span><EnvironmentOutlined /> {job.location}</span><span>{job.compensation}</span></div>
                <div className="job-tags"><Tag>{job.type}</Tag><Tag>{job.category}</Tag></div>
              </div>
            </article>
          );
        })}
        {!filteredJobs.length && <p className="jobs-empty">No roles match that search.</p>}
      </section>
    </WorkspacePage>
  );
}