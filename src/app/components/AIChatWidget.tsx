import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  ExternalLink,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { PROJECTS_DATA, Project } from '../data/projects';
import { trackEvent } from '../lib/analytics';

type AssistantAction =
  | { label: string; kind: 'page'; page: string }
  | { label: string; kind: 'project'; slug: string }
  | { label: string; kind: 'external'; href: string };

interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  actions?: AssistantAction[];
}

interface AssistantReply {
  text: string;
  actions?: AssistantAction[];
}

interface AIChatWidgetProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const PROFILE = {
  name: 'Paneendra Kumar',
  education: 'B.Tech in Mechanical Engineering at NIT Durgapur',
  email: 'paneendra100@gmail.com',
  github: 'https://github.com/paneendrakumar0',
  linkedin: 'https://linkedin.com/in/paneendra-kumar-53b0a3274',
  focus: 'robotics, embodied AI, computer vision, simulation, and control systems',
};

const INITIAL_MESSAGE: Message = {
  id: 1,
  type: 'bot',
  text: `Hi — I’m Paneendra’s portfolio guide. My answers are grounded in the ${PROJECTS_DATA.length} verified projects on this site. Ask about his work, technical strengths, education, or how to connect.`,
};

const SUGGESTED_QUERIES = [
  'Strongest robotics project',
  'Projects using ROS 2',
  'Technical strengths',
  'How can I contact Paneendra?',
];

const STOP_WORDS = new Set([
  'a',
  'about',
  'all',
  'an',
  'and',
  'are',
  'can',
  'for',
  'his',
  'in',
  'is',
  'me',
  'of',
  'on',
  'project',
  'projects',
  'show',
  'tell',
  'the',
  'to',
  'using',
  'what',
  'with',
]);

const projectAction = (project: Project): AssistantAction => ({
  label: `Open ${project.title}`,
  kind: 'project',
  slug: project.slug,
});

const containsAny = (value: string, terms: string[]) =>
  terms.some((term) => value.includes(term));

function matchingProjects(query: string) {
  const searchTerms = query
    .toLowerCase()
    .split(/[^a-z0-9+#./-]+/)
    .filter((term) => term.length > 1 && !STOP_WORDS.has(term));

  if (!searchTerms.length) return [];

  return PROJECTS_DATA.map((project) => {
    const title = project.title.toLowerCase();
    const tech = project.tech.join(' ').toLowerCase();
    const searchable = [
      title,
      project.slug,
      tech,
      project.category,
      project.discipline,
      project.description,
      project.fullDescription,
      project.challenge,
      project.approach,
    ]
      .join(' ')
      .toLowerCase();

    const score = searchTerms.reduce((total, term) => {
      if (!searchable.includes(term)) return total;
      if (title.includes(term)) return total + 5;
      if (tech.includes(term)) return total + 3;
      return total + 1;
    }, 0);

    return { project, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || Number(b.project.featured) - Number(a.project.featured))
    .map(({ project }) => project);
}

function buildReply(rawQuery: string): AssistantReply {
  const query = rawQuery.toLowerCase().trim();
  const matches = matchingProjects(query);
  const isGreeting = /^(hi|hello|hey|good morning|good evening)\b/.test(query);

  if (isGreeting) {
    return {
      text: `Hello! I can help you evaluate ${PROFILE.name}’s verified engineering work or take you directly to the relevant evidence.`,
      actions: [
        { label: 'Explore projects', kind: 'page', page: 'Projects' },
        { label: 'Recruiter overview', kind: 'page', page: 'Home' },
      ],
    };
  }

  if (containsAny(query, ['contact', 'email', 'mail', 'reach', 'connect', 'linkedin'])) {
    return {
      text: `The direct email is ${PROFILE.email}. You can also use the contact page, GitHub, or LinkedIn. The portfolio does not claim a specific availability status, so contacting Paneendra is the best way to discuss an opportunity.`,
      actions: [
        { label: 'Open contact page', kind: 'page', page: 'Contact' },
        { label: 'LinkedIn', kind: 'external', href: PROFILE.linkedin },
        { label: 'GitHub', kind: 'external', href: PROFILE.github },
      ],
    };
  }

  if (containsAny(query, ['education', 'college', 'university', 'degree', 'student', 'study'])) {
    return {
      text: `${PROFILE.name} is pursuing a ${PROFILE.education}. His portfolio connects that mechanical-engineering foundation with software, perception, simulation, and intelligent robotic systems.`,
      actions: [
        { label: 'View achievements', kind: 'page', page: 'Achievements' },
        { label: 'View certifications', kind: 'page', page: 'Certifications' },
      ],
    };
  }

  if (containsAny(query, ['resume', 'résumé', 'cv', 'recruiter', 'hire'])) {
    return {
      text: `For a quick evaluation, start with the recruiter snapshot and featured work on the home page. The strongest evidence is in the project case studies, where role, approach, outcomes, and source links are separated clearly.`,
      actions: [
        { label: 'Recruiter snapshot', kind: 'page', page: 'Home' },
        { label: 'Project case studies', kind: 'page', page: 'Projects' },
        { label: 'Discuss an opportunity', kind: 'page', page: 'Contact' },
      ],
    };
  }

  if (
    containsAny(query, [
      'skill',
      'stack',
      'strength',
      'special',
      'expert',
      'language',
      'technology',
      'technologies',
    ])
  ) {
    return {
      text: `The strongest demonstrated areas are ${PROFILE.focus}. Repeated tools across the verified work include ROS 2, Python, Gazebo, OpenCV, C++, PX4 SITL, MediaPipe, and robot kinematics. These are evidence-backed by the linked repositories rather than a standalone skills claim.`,
      actions: [
        projectAction(PROJECTS_DATA[0]),
        projectAction(PROJECTS_DATA[1]),
        { label: 'Browse all evidence', kind: 'page', page: 'Projects' },
      ],
    };
  }

  if (containsAny(query, ['best', 'strongest', 'featured', 'flagship', 'robotics'])) {
    const featured = PROJECTS_DATA.filter((project) => project.featured);
    return {
      text: `The strongest robotics evidence starts with ${featured[0].title}: it documents a 20.2% payload-tracking improvement and an 11.7% mean cable-angle reduction in PX4 SITL experiments. ${featured[1].title} is the broadest system-integration example, spanning perception, control, planning, RL scaffolding, and serial output.`,
      actions: featured.slice(0, 3).map(projectAction),
    };
  }

  if (matches.length) {
    const topMatches = matches.slice(0, 3);
    const summary = topMatches
      .map(
        (project) =>
          `${project.title} — ${project.description} Stack: ${project.tech.slice(0, 4).join(', ')}.`,
      )
      .join('\n\n');

    return {
      text: `I found ${topMatches.length} relevant verified ${topMatches.length === 1 ? 'project' : 'projects'}:\n\n${summary}`,
      actions: topMatches.map(projectAction),
    };
  }

  if (containsAny(query, ['project', 'work', 'portfolio', 'build', 'made'])) {
    const featured = PROJECTS_DATA.filter((project) => project.featured);
    return {
      text: `This portfolio currently documents ${PROJECTS_DATA.length} verified projects across robotics, AI/ML, simulation, and web engineering. The featured case studies are ${featured.map((project) => project.title).join(', ')}.`,
      actions: [
        ...featured.slice(0, 2).map(projectAction),
        { label: 'Browse all projects', kind: 'page', page: 'Projects' },
      ],
    };
  }

  if (containsAny(query, ['who', 'about', 'paneendra'])) {
    return {
      text: `${PROFILE.name} is a ${PROFILE.education} focused on ${PROFILE.focus}. This assistant only summarizes information supported by this portfolio’s verified project dataset.`,
      actions: [
        { label: 'See featured work', kind: 'page', page: 'Home' },
        { label: 'Explore all projects', kind: 'page', page: 'Projects' },
      ],
    };
  }

  return {
    text: `I couldn’t tie that question to the verified portfolio data, so I won’t invent an answer. Try asking about a technology such as ROS 2, OpenCV, PX4, or Python—or use one of the shortcuts below.`,
    actions: [
      { label: 'Explore projects', kind: 'page', page: 'Projects' },
      { label: 'Contact Paneendra', kind: 'page', page: 'Contact' },
    ],
  };
}

export function AIChatWidget({ currentPage, onNavigate }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const replyTimerRef = useRef<number | null>(null);
  const messageIdRef = useRef(2);
  const suggestedQueries = useMemo(
    () => (messages.length === 1 ? SUGGESTED_QUERIES : SUGGESTED_QUERIES.slice(0, 2)),
    [messages.length],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) window.setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    };
  }, []);

  const handleSend = (text = input) => {
    const cleanText = text.trim();
    if (!cleanText || isTyping) return;

    setMessages((previous) => [
      ...previous,
      { id: messageIdRef.current++, type: 'user', text: cleanText },
    ]);
    setInput('');
    setIsTyping(true);
    trackEvent('assistant_question', { page: currentPage });

    replyTimerRef.current = window.setTimeout(() => {
      const reply = buildReply(cleanText);
      setMessages((previous) => [
        ...previous,
        { id: messageIdRef.current++, type: 'bot', ...reply },
      ]);
      setIsTyping(false);
      replyTimerRef.current = null;
    }, 450);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSend();
  };

  const handleAction = (action: AssistantAction) => {
    if (action.kind === 'external') return;

    if (action.kind === 'project') {
      const url = new URL('/projects', window.location.origin);
      url.searchParams.set('project', action.slug);
      window.history.pushState({ page: 'Projects' }, '', url);
      onNavigate('Projects');
    } else {
      onNavigate(action.page);
    }

    trackEvent('assistant_navigation', {
      destination: action.kind === 'project' ? 'project_case_study' : action.page,
    });
    setIsOpen(false);
  };

  const resetConversation = () => {
    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    replyTimerRef.current = null;
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setIsTyping(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            aria-label="Open portfolio assistant"
            initial={{ scale: 0, rotate: 120 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -120 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              setIsOpen(true);
              trackEvent('assistant_open', { page: currentPage });
            }}
            className="group fixed bottom-5 right-5 z-[80] flex h-14 items-center gap-2 overflow-hidden rounded-full border border-cyan-300/30 bg-gradient-to-r from-purple-600 to-cyan-600 px-4 text-white shadow-[0_0_28px_rgba(34,211,238,0.28)] md:bottom-8 md:right-8"
          >
            <Sparkles className="h-5 w-5 shrink-0" />
            <span className="hidden text-sm font-bold sm:inline">Ask portfolio</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Paneendra's portfolio assistant"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.96 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-x-3 bottom-3 z-[90] flex h-[min(650px,calc(100vh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080b12]/95 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[430px]"
          >
            <header className="border-b border-white/10 bg-gradient-to-r from-purple-950/80 to-cyan-950/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2">
                    <Bot className="h-5 w-5 text-cyan-300" />
                  </span>
                  <div>
                    <h2 className="font-bold text-white">Portfolio guide</h2>
                    <p className="mt-0.5 text-xs text-cyan-100/70">
                      Grounded in {PROJECTS_DATA.length} verified projects · Viewing {currentPage}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={resetConversation}
                    aria-label="Reset conversation"
                    title="Reset conversation"
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close portfolio assistant"
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </header>

            <div
              aria-live="polite"
              className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={message.type === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3 text-sm leading-relaxed ${
                      message.type === 'user'
                        ? 'rounded-br-md bg-cyan-600 text-white'
                        : 'rounded-bl-md border border-white/10 bg-white/[0.06] text-gray-200'
                    }`}
                  >
                    {message.text.split('\n').map((line, index) =>
                      line ? (
                        <p key={index} className={index ? 'mt-2' : undefined}>
                          {line}
                        </p>
                      ) : null,
                    )}
                    {message.actions?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.map((action) =>
                          action.kind === 'external' ? (
                            <a
                              key={`${action.kind}-${action.label}`}
                              href={action.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/15"
                            >
                              {action.label}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <button
                              key={`${action.kind}-${action.label}`}
                              type="button"
                              onClick={() => handleAction(action)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-left text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/15"
                            >
                              {action.label}
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          ),
                        )}
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 pl-2 text-xs text-gray-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                  Checking verified portfolio data…
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 bg-black/35 p-4">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {suggestedQueries.map((query) => (
                  <button
                    key={query}
                    type="button"
                    onClick={() => handleSend(query)}
                    disabled={isTyping}
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300 transition hover:border-purple-400/50 hover:text-white disabled:opacity-40"
                  >
                    {query}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <label htmlFor="portfolio-assistant-input" className="sr-only">
                  Ask about Paneendra’s portfolio
                </label>
                <input
                  ref={inputRef}
                  id="portfolio-assistant-input"
                  type="text"
                  value={input}
                  maxLength={240}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about a project, skill, or technology…"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  aria-label="Send question"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 p-3 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-gray-600">
                Local, deterministic answers · No message data is sent to an AI service
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
