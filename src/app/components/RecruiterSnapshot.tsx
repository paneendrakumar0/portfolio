import React from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Download,
  ExternalLink,
  GraduationCap,
  Layers3,
  MapPin,
  Radar,
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface RecruiterSnapshotProps {
  onNavigate: (page: string) => void;
}

const strengths = [
  'ROS 2 systems',
  'Robot simulation',
  'Computer vision',
  'Control & telemetry',
  'Hardware integration',
  'Technical documentation',
];

export function RecruiterSnapshot({ onNavigate }: RecruiterSnapshotProps) {
  return (
    <section id="recruiter-snapshot" aria-labelledby="recruiter-snapshot-title" className="py-16 md:py-20 border-t border-white/5">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent overflow-hidden">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 md:p-10 lg:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-purple-300 mb-6">
              <Radar aria-hidden="true" className="w-3.5 h-3.5" />
              Recruiter snapshot
            </div>

            <h2 id="recruiter-snapshot-title" className="text-3xl md:text-5xl font-black tracking-tight text-white mb-5">
              Mechanical foundations.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Intelligent systems.
              </span>
            </h2>

            <p className="max-w-2xl text-gray-400 leading-relaxed mb-8">
              B.Tech Mechanical Engineering student at NIT Durgapur building simulation-first robotics, embodied AI, computer-vision, and control-system projects with measurable validation.
            </p>

            <dl className="grid sm:grid-cols-2 gap-4 mb-8">
              <SnapshotItem
                icon={<GraduationCap />}
                label="Education"
                value="B.Tech, Mechanical Engineering"
              />
              <SnapshotItem
                icon={<MapPin />}
                label="Based at"
                value="NIT Durgapur, India"
              />
              <SnapshotItem
                icon={<BriefcaseBusiness />}
                label="Career direction"
                value="Robotics & Embodied AI"
              />
              <SnapshotItem
                icon={<Layers3 />}
                label="Working style"
                value="Build, test, document"
              />
            </dl>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  trackEvent('external_profile_click', { destination: 'contact', source: 'recruiter_snapshot' });
                  onNavigate('Contact');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black hover:bg-cyan-300 transition-colors"
              >
                Discuss an opportunity
                <ArrowRight aria-hidden="true" className="w-4 h-4" />
              </button>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('resume_open', { source: 'recruiter_snapshot' })}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                <Download aria-hidden="true" className="w-4 h-4" />
                View résumé
              </a>
              <a
                href="https://github.com/paneendrakumar0"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('external_profile_click', { destination: 'github', source: 'recruiter_snapshot' })}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors"
              >
                GitHub
                <ExternalLink aria-hidden="true" className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="border-t lg:border-t-0 lg:border-l border-white/10 bg-black/20 p-6 md:p-10 lg:p-12">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mb-5">
              Core engineering strengths
            </p>
            <div className="flex flex-wrap gap-2 mb-9">
              {strengths.map((strength) => (
                <span
                  key={strength}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                >
                  {strength}
                </span>
              ))}
            </div>

            <div className="space-y-5">
              <EvidenceBar label="Robotics systems" value="ROS 2 · PX4 · Gazebo" width="92%" />
              <EvidenceBar label="Perception & AI" value="OpenCV · RL · MediaPipe" width="84%" />
              <EvidenceBar label="Engineering tools" value="Python · C++ · CAD" width="88%" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SnapshotItemProps {
  icon: React.ReactElement;
  label: string;
  value: string;
}

function SnapshotItem({ icon, label, value }: SnapshotItemProps) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/5 bg-black/20 p-4">
      <span className="text-cyan-400">
        {React.cloneElement(icon, { 'aria-hidden': true, className: 'w-5 h-5' })}
      </span>
      <div>
        <dt className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">{label}</dt>
        <dd className="text-sm font-semibold text-gray-200">{value}</dd>
      </div>
    </div>
  );
}

function EvidenceBar({ label, value, width }: { label: string; value: string; width: string }) {
  return (
    <div>
      <div className="flex justify-between gap-4 text-xs mb-2">
        <span className="font-bold text-gray-300">{label}</span>
        <span className="text-gray-600">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
          style={{ width }}
        />
      </div>
    </div>
  );
}
