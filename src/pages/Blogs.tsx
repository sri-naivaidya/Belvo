import { useRef, useState, type ElementType } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderKanban,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { blogPosts, type BlogPost } from "@/content/blogs";
import { caseStudies, type CaseStudy } from "@/content/case-studies";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Footer from "@/sections/Footer";

type ResourceType = "blogs" | "newsletters" | "case-studies";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      delay: index * 0.07,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const resourceTypes: Array<{
  id: ResourceType;
  title: string;
  eyebrow: string;
  description: string;
  detail: string;
  icon: typeof Newspaper;
}> = [
  {
    id: "blogs",
    title: "Blogs",
    eyebrow: "Ideas & opinions",
    description:
      "Punchy, practical reads on the digital work that helps brands stay relevant.",
    detail: "Top posts & archive",
    icon: Newspaper,
  },
  {
    id: "newsletters",
    title: "Newsletters",
    eyebrow: "Stories & playbooks",
    description:
      "Six recurring content pillars for founders, teams, and curious builders.",
    detail: "1 issue & 6 pillars",
    icon: BookOpen,
  },
  {
    id: "case-studies",
    title: "Case Studies",
    eyebrow: "Work & outcomes",
    description:
      "Evergreen client stories built around the challenge, the work, and the result.",
    detail: "14 case studies",
    icon: BriefcaseBusiness,
  },
];

const newsletterPillars = [
  {
    number: "01",
    title: "Behind the Build",
    description:
      "Client and project stories shaped from Belvo's published updates.",
    label: "Client stories",
  },
  {
    number: "02",
    title: "Playbook: Start a Company From Scratch",
    description:
      "A stage-by-stage founder guide from the first idea to long-term brand building.",
    label: "First series",
  },
  {
    number: "03",
    title: "Myth Busting",
    description:
      "Clear, useful answers to the marketing claims founders hear most often.",
    label: "5 topics",
  },
  {
    number: "04",
    title: "Employment Perks",
    description:
      "A closer look at Belvo's culture, benefits, and developer experience.",
    label: "People & culture",
  },
  {
    number: "05",
    title: "Growth Story of Belvo",
    description:
      "The milestones, lessons, and decisions behind Belvo's journey.",
    label: "Company story",
  },
  {
    number: "06",
    title: "Team Story of Belvo",
    description:
      "Team spotlights, short interviews, and stories from the people building Belvo.",
    label: "Team spotlight",
  },
];

const workplaceNewsletter: BlogPost = {
  slug: "belvo-gen-z-workplace-perks",
  title: "Inside Belvo: Workplace Perks That Actually Get Gen Z",
  date: "2026-07-22",
  category: "Employment Perks",
  excerpt:
    "Blinkit rewards, useful subscriptions, gym access, paid projects, hackathons, and a culture where interns help shape the fun - not just watch it.",
  thumbnail: "/newsletter-covers/gen-z-workplace-perks.svg",
  content: `# Inside Belvo: Workplace Perks That Actually Get Gen Z

A workplace perk should do more than look cute in an onboarding deck. It should make work easier, reward real effort, and give people more ways to learn, create, and enjoy the team they are part of.

## Rewards That Show Up in Real Life

Good work deserves more than a thumbs-up reaction. Belvo's Blinkit reward system and voucher system turn appreciation into something interns and employees can actually use.

## Your Subscriptions Are Part of the Toolkit

The right tools help people work smarter and stay inspired. Team access can include platforms such as Spotify, Netflix, Claude, Amazon Prime, GPT, and other useful services depending on the work and program.

## Work Hard, Move Too

Gym membership support makes wellbeing part of the routine instead of something that gets pushed to next Monday.

## Intern Does Not Mean Side Character

Interns get opportunities to join partnership programs, contribute to paid projects, and participate in hackathons. The goal is real exposure, real ownership, and work that belongs in a portfolio.

## The Culture Lives Beyond Meetings

The team uses its Instagram group for fun conversations, video calls, shared moments, and the kind of casual interaction that makes a remote or hybrid workplace feel human.

## Interns Help Create the Vibe

Interns also create content for Belvo's Instagram in their own fun, relevant style. They do not just experience the culture - they help communicate it.

## A Complete Gen Z Workplace

Belvo is building a workplace around access, recognition, wellbeing, creativity, and community. The work stays professional. The environment does not have to feel outdated.

The best workplace perk is feeling trusted enough to contribute and supported enough to grow.`,
};

/* =========================================================
   EMPLOYMENT PERKS ARTICLE
========================================================= */

const employmentPerksNewsletter: BlogPost = {
  slug: "belvo-employment-internship-perks",

  title:
    "Inside Belvo: The Perks, Benefits & Opportunities of Being Part of Our Team",

  date: "2026-07-24",

  category: "Employment Perks",

  excerpt:
    "From sponsored trips and annual gym memberships to health insurance, performance rewards, mentorship, and internship opportunities — here's what being part of Belvo can offer.",

  thumbnail: "/blog-covers/unlimited-pto.jpg",

  content: `
At Belvo, we believe that a great workplace is about more than the work you do. It is also about feeling supported, recognised, and given opportunities to grow both professionally and personally.

That's why we're building a workplace culture where people can learn, perform, stay healthy, celebrate their achievements, and grow alongside the company.

Here are some of the perks and benefits available to eligible members of the Belvo team.

## 1. Sponsored Trips & Team Experiences

Great teams aren't built only inside meetings.

Belvo organises sponsored trips and team experiences designed to give people an opportunity to relax, connect, and create memories outside their regular work environment.

These experiences can include team outings, company trips, celebrations, and other activities depending on company programs and eligibility.

## 2. Annual Gym Membership

Physical wellbeing plays an important role in maintaining energy, focus, and a healthy work-life balance.

Eligible employees can receive annual gym membership support, helping them make fitness a consistent part of their routine.

We want our team members to have the resources to invest not only in their careers but also in their physical wellbeing.

## 3. Health Insurance

Your health should always come first.

Eligible employees may receive health insurance benefits according to the company's applicable policies and plans.

Our aim is to provide additional security and support so team members can focus on their work and personal growth with greater peace of mind.

## 4. Monthly Vouchers & Performance-Based Gifts

Good work deserves meaningful recognition.

Team members who demonstrate strong performance, consistency, creativity, ownership, or exceptional contribution may receive monthly vouchers and special gifts.

Rewards can be linked to individual achievements, important milestones, team contributions, and overall performance.

It's our way of recognising the people who consistently go beyond expectations.

## 5. Free Yoga Classes

A healthy workplace should support both physical and mental wellbeing.

Belvo provides access to free yoga classes through applicable company wellness programs, giving team members an opportunity to relax, improve flexibility, and take time away from their screens.

Sometimes the best way to improve productivity is simply to give your mind and body the space to reset.

## 6. Free Mentorship Classes

Growth should not stop after joining a company.

Team members can get access to mentorship and learning sessions designed to help them improve their professional and personal skills.

Depending on the program, mentorship sessions may cover areas such as:

- Career development
- Technical and professional skills
- Leadership
- Communication
- Personal branding
- Productivity
- Business and entrepreneurship
- Industry knowledge

The goal is to create an environment where people continuously learn from experienced professionals and from each other.

## 7. Appraisals & Seasonal Bonuses

Strong performance should create opportunities for professional and financial growth.

Employees may be considered for performance appraisals based on their contribution, responsibilities, consistency, and overall impact.

Eligible team members may also receive seasonal or performance-based bonuses according to company policies and business performance.

We want people who contribute to Belvo's growth to have opportunities to grow with it.

## 8. Premium Tools & Subscriptions

The right tools can make work easier, faster, and more creative.

Depending on role requirements and company programs, eligible team members may receive access to useful premium tools and subscriptions such as:

- ChatGPT
- Claude
- Spotify
- Productivity platforms
- Professional tools relevant to their work

The exact subscriptions available may vary depending on the person's role and requirements.

## 9. Recognition & Reward Programs

Recognition should be part of the culture, not something that happens once a year.

Through reward programs such as Blinkit rewards, vouchers, gifts, and other performance-based incentives, we aim to recognise meaningful contributions throughout the year.

Whether someone solves a difficult problem, delivers exceptional work, supports their team, or introduces a valuable idea, great contributions deserve to be noticed.

## More Than Just Employee Benefits

The goal behind these perks isn't simply to create a long list of benefits.

We want to build an environment where people feel:

- Supported in their wellbeing
- Recognised for their contributions
- Encouraged to keep learning
- Connected with their teammates
- Rewarded for strong performance
- Given opportunities for long-term growth

As Belvo continues to grow, our workplace programs and benefits will continue evolving with our team.

# Starting Your Journey With Belvo: Internship Perks

For students and freshers, an internship can be the first step toward becoming part of the Belvo journey.

We currently offer a 3-month unpaid internship program designed to give individuals practical exposure, opportunities to develop their skills, and experience working on meaningful projects.

Along with practical work experience, interns can access a range of opportunities and benefits depending on their performance, role, and program eligibility.

## Offer Letter & Letter of Recommendation

Selected interns receive an Offer Letter when they join the internship program.

After successfully completing the internship, eligible interns may also receive a Letter of Recommendation based on their contribution, professionalism, consistency, and overall performance.

## Real-World Project Experience

Interns aren't expected to simply watch from the sidelines.

Depending on their role, they may get opportunities to:

- Work on real-world projects
- Build portfolio-worthy work
- Collaborate directly with team members
- Participate in brainstorming sessions
- Explore new tools and technologies
- Take ownership of assigned responsibilities
- Contribute ideas to active projects

The goal is to provide practical exposure that goes beyond theoretical learning.

## Premium Tools & Subscriptions

Depending on their work requirements and availability, interns may receive access to useful tools and subscriptions such as:

- ChatGPT
- Claude
- Spotify
- Productivity tools
- Other professional platforms

These resources are intended to support learning and help interns improve the quality of their work.

## Blinkit Rewards, Vouchers & Gifts

Strong contributions deserve recognition regardless of job title.

Interns who demonstrate exceptional performance, creativity, consistency, or ownership may receive:

- Blinkit rewards
- Monthly vouchers
- Performance-based gifts
- Special recognition for achievements

These programs are designed to make meaningful contributions visible and appreciated.

## Free Mentorship & Learning Opportunities

Interns can also benefit from mentorship and learning opportunities.

These sessions can help interns understand professional workflows, improve their skills, receive career guidance, and learn directly from people with practical experience.

## Wellness & Team Experiences

Depending on the internship program and eligibility, interns may also get opportunities to participate in selected wellness programs, team activities, yoga sessions, meetups, and company experiences.

Specific employee benefits such as health insurance, annual gym memberships, sponsored trips, appraisals, and bonuses may be subject to employment status and company policies.

## Performance-Based Placement Opportunities

Your journey with Belvo doesn't necessarily have to end after three months.

Interns who demonstrate strong skills, consistency, professionalism, ownership, and alignment with the team may be considered for employment opportunities based on:

- Individual performance
- Available positions
- Business requirements
- Required skills
- Overall contribution during the internship

The internship can therefore become an opportunity to demonstrate what you're capable of in a real working environment.

## Partnership & Equity-Based Opportunities

Exceptional contribution can sometimes lead to opportunities beyond traditional employment.

Individuals who demonstrate significant long-term value, commitment, leadership, and alignment with Belvo's vision may potentially be considered for partnership or equity-based collaboration opportunities.

Any such arrangement would depend on individual contribution, business requirements, mutual agreement, and formal terms.

## From Intern to Team Member

The internship program and employee benefits are connected by one simple idea: growth.

You may start your Belvo journey as an intern, gain practical experience, demonstrate your capabilities, and potentially move toward a longer-term opportunity.

As you progress, the opportunities available to you can grow too — from learning and mentorship to professional responsibilities, recognition, employee benefits, appraisals, and long-term career opportunities.

## Interested in Joining Belvo?

Whether you're an experienced professional looking for your next opportunity or a student searching for practical experience, we're always interested in meeting ambitious people who want to learn, contribute, and grow.

If you're interested in exploring opportunities with Belvo, DM us with **"Interested"** and tell us a little about yourself, your skills, and the kind of role you're looking for.

Your journey with Belvo could start with an internship — and grow into something much bigger.
`,
};

/* =========================================================
   TEAM STORY OF BELVO ARTICLE
========================================================= */

const teamBelvoNewsletter: BlogPost = {
  slug: "team-story-of-belvo",

  title: "Team Story of Belvo",

  date: "2026-07-30",

  category: "Team Story",

  excerpt:
    "Meet the people behind Belvo — a growing team of creative thinkers, developers, marketers, and ambitious individuals working together to learn, build, and grow.",

  thumbnail: "/blog-covers/team-story-belvo.jpg",

  content: `
Behind every project, every idea, and every milestone at Belvo is a team of people working together to turn ideas into something meaningful.

Belvo is not built by one person or one department. It is being shaped by people with different skills, backgrounds, experiences, and ambitions who share one common goal — to build, learn, and grow together.

This is the story of the people behind Belvo.

## Different People. Different Skills. One Team.

A strong team doesn't need everyone to think the same way.

At Belvo, our team brings together people interested in different areas, including:

- Web development
- UI/UX and graphic design
- Digital marketing
- Content creation
- Social media
- Business development
- Strategy
- Operations
- Emerging technologies

Every person brings a different perspective to the table.

Developers think about how something works. Designers think about how it feels. Marketers think about how people discover it. Content creators think about how the story is communicated.

When these different perspectives come together, better ideas are created.

## A Team That Is Still Growing

Belvo's story is still being written.

As the company grows, new people join with new skills, ideas, and perspectives. Some may join as experienced professionals, while others may begin their journey as interns or freshers looking for their first real-world opportunity.

What matters most is the willingness to learn, contribute, communicate, and take ownership.

We believe talented people can come from many different backgrounds, and sometimes the person with the least traditional experience can bring the most unexpected idea.

## Interns Are Part of the Team

At Belvo, interns are not meant to simply sit on the sidelines and observe.

They are encouraged to participate in real work, contribute ideas, ask questions, and become an active part of the team.

Depending on their role, interns may get opportunities to:

- Work on real-world projects
- Collaborate with different departments
- Participate in brainstorming sessions
- Suggest improvements and new ideas
- Explore new tools and technologies
- Build portfolio-worthy work
- Take ownership of assigned responsibilities
- Learn professional workflows

The goal is to help people understand what working as part of a real team actually feels like.

## Learning From Each Other

We believe knowledge becomes more valuable when it is shared.

Team members can learn from each other's experiences, skills, successes, and even mistakes.

A developer might learn something about design.

A designer might understand marketing better.

A marketer might discover how technology can improve a campaign.

An intern might introduce a new tool that the rest of the team has never explored.

Learning does not always have to happen inside a formal classroom.

Sometimes the most valuable lessons come from working together on a difficult problem.

## Free Mentorship & Learning Sessions

Professional growth is an important part of the Belvo culture.

Team members and eligible interns can get opportunities to participate in mentorship and learning sessions covering areas such as:

- Career development
- Technical skills
- Communication
- Leadership
- Personal branding
- Productivity
- Business and entrepreneurship
- Industry knowledge

The goal is to create an environment where people don't just complete their work — they continuously improve their skills.

## Everyone Can Bring Ideas

Good ideas are not limited by job titles.

Whether someone is a senior team member, a new employee, or an intern, they should feel comfortable sharing an idea that could improve the company.

That idea might be:

- A better way to complete a task
- A new content concept
- A useful technology
- A project improvement
- A marketing campaign
- A workplace activity
- A new business opportunity

Not every idea will become a project, but everyone should have the opportunity to contribute.

## Taking Ownership

One of the most important qualities we value is ownership.

Taking ownership means caring about the outcome of your work instead of simply completing a task because someone assigned it.

We encourage our team to ask:

- Can this be improved?
- Is there a better solution?
- What can I learn from this?
- How can I help the team?
- What can I take responsibility for?

People grow faster when they move from waiting for instructions to actively looking for ways to contribute.

## Celebrating Good Work

Recognition is an important part of building a motivated team.

Strong performance, creativity, consistency, and meaningful contributions can be recognised through different initiatives and reward programs.

Depending on eligibility and company programs, recognition may include:

- Monthly vouchers
- Performance-based gifts
- Blinkit rewards
- Special team recognition
- Seasonal bonuses
- Performance appraisals
- Additional growth opportunities

Sometimes recognition can also be as simple as making sure someone's contribution is seen and appreciated by the team.

## Building Connections Beyond Work

A team should know each other as people, not only as names appearing in meetings and project management tools.

Belvo aims to create opportunities for team members to connect beyond everyday work through:

- Sponsored trips
- Team outings
- Informal meetups
- Celebrations
- Group activities
- Online conversations
- Team video calls
- Shared challenges and experiences

These moments help create stronger relationships and make collaboration more natural.

## Supporting Health & Wellbeing

Doing good work also requires taking care of yourself.

Depending on employment status, eligibility, and applicable company programs, team members may receive access to wellbeing benefits such as:

- Annual gym membership support
- Free yoga classes
- Health insurance
- Wellness activities
- Team experiences

The goal is to create a workplace where professional growth and personal wellbeing can exist together.

## Growing With the Company

As Belvo grows, we want our people to have opportunities to grow alongside it.

For employees, this can include increased responsibilities, appraisals, bonuses, leadership opportunities, and professional development.

For interns, strong performance can potentially create opportunities for:

- Longer-term roles
- Placement opportunities
- Paid project opportunities
- Greater responsibilities
- Continued collaboration
- Partnership opportunities in exceptional cases

Every opportunity depends on individual contribution, performance, available roles, business requirements, and mutual agreement.

## From Intern to Team Member

For many people, the journey may begin with an internship.

A three-month internship can become an opportunity to understand the team, gain practical experience, develop professional skills, and demonstrate what you can contribute.

Interns who consistently perform well may be considered for longer-term opportunities depending on available positions and business requirements.

The goal is to create a path where people can enter with the willingness to learn and gradually earn bigger opportunities through their contribution.

## More Than Colleagues

The culture we want to build at Belvo is based on a simple idea:

Work should remain professional, but the people you work with should never feel like strangers.

We want a team where people can collaborate seriously on an important project, learn from each other, celebrate achievements together, and still have fun along the way.

Because companies are ultimately not built by websites, tools, or strategies.

They are built by people.

## The Next Chapter of Belvo's Team Story

Belvo's team story is not finished.

Every new person who joins adds something different to it.

A new skill.

A different perspective.

A new idea.

A new ambition.

And potentially, an entirely new direction that we haven't discovered yet.

Whether you join as an intern, employee, collaborator, or long-term partner, the opportunity is the same — contribute something meaningful and become part of what we're building.

## Interested in Becoming Part of the Team?

If you're interested in joining Belvo, DM us with **"Interested"** and tell us about yourself, your skills, and the kind of opportunity you're looking for.

We're always interested in discovering people who are curious, ambitious, willing to learn, and ready to contribute.

The next chapter of the **Team Story of Belvo** could include you.
`,
};

const caseStudySteps = [
  {
    title: "Challenge",
    description:
      "The client context, the real constraint, and what needed to change.",
  },
  {
    title: "What Belvo Did",
    description:
      "The strategy, creative choices, and execution behind the work.",
  },
  {
    title: "Result",
    description:
      "The outcome, supported by clear numbers wherever they are available.",
  },
];

function openPdf(pdfPath: string) {
  if (typeof window === "undefined") return;

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.assign(`${basePath}${pdfPath}`);
}

function renderBlogContent(content: string) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const headingMatch = block.match(/^(#{1,6})\s+(.*)$/);

    if (headingMatch) {
      const HeadingTag = `h${Math.min(
        headingMatch[1].length,
        4,
      )}` as ElementType;

      return (
        <HeadingTag
          key={`heading-${index}`}
          style={{
            color: "var(--belvo-text-1)",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            margin: "12px 0 6px",
          }}
        >
          {headingMatch[2]}
        </HeadingTag>
      );
    }

    if (block.split("\n").every((line) => line.startsWith("- "))) {
      return (
        <ul
          key={`list-${index}`}
          style={{
            color: "var(--belvo-text-2)",
            lineHeight: 1.75,
            margin: "0 0 12px",
            paddingLeft: 22,
          }}
        >
          {block.split("\n").map((line) => (
            <li key={line}>{line.replace(/^-\s*/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p
        key={`paragraph-${index}`}
        style={{
          color: "var(--belvo-text-2)",
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.96rem",
          lineHeight: 1.8,
          margin: "0 0 12px",
        }}
      >
        {block}
      </p>
    );
  });
}

function ResourceSelector({
  activeResource,
  onSelect,
}: {
  activeResource: ResourceType;
  onSelect: (resource: ResourceType) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        gap: 16,
      }}
    >
      {resourceTypes.map((resource, index) => {
        const Icon = resource.icon;
        const isActive = activeResource === resource.id;

        return (
          <motion.button
            key={resource.id}
            type="button"
            custom={index}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.99 }}
            aria-pressed={isActive}
            onClick={() => onSelect(resource.id)}
            data-testid={`resource-selector-${resource.id}`}
            style={{
              appearance: "none",
              background: isActive
                ? "linear-gradient(145deg, rgba(157,78,221,0.2), rgba(255,154,201,0.08))"
                : "var(--belvo-bg-card)",
              border: isActive
                ? "1px solid rgba(187,120,244,0.62)"
                : "1px solid var(--belvo-border-card)",
              borderRadius: 22,
              boxShadow: isActive
                ? "0 18px 55px rgba(92,31,148,0.2)"
                : "none",
              color: "var(--belvo-text-1)",
              cursor: "pointer",
              minHeight: 250,
              padding: 26,
              textAlign: "left",
              transition:
                "border-color 220ms ease, box-shadow 220ms ease, background 220ms ease",
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: isActive
                  ? "rgba(157,78,221,0.2)"
                  : "rgba(157,78,221,0.09)",
                border: "1px solid rgba(157,78,221,0.25)",
                borderRadius: 14,
                color: "#b87cff",
                display: "flex",
                height: 48,
                justifyContent: "center",
                marginBottom: 28,
                width: 48,
              }}
            >
              <Icon size={22} />
            </div>

            <span
              style={{
                color: "#b87cff",
                display: "block",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.64rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                marginBottom: 9,
                textTransform: "uppercase",
              }}
            >
              {resource.eyebrow}
            </span>

            <h2
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.48rem",
                fontWeight: 850,
                letterSpacing: "-0.02em",
                margin: "0 0 10px",
              }}
            >
              {resource.title}
            </h2>

            <p
              style={{
                color: "var(--belvo-text-6)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.86rem",
                lineHeight: 1.65,
                margin: "0 0 24px",
              }}
            >
              {resource.description}
            </p>

            <span
              style={{
                alignItems: "center",
                color: isActive ? "#c996ff" : "var(--belvo-text-2)",
                display: "inline-flex",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 650,
                gap: 8,
              }}
            >
              {resource.detail} <ArrowRight size={14} />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function BlogCard({
  post,
  index,
  onOpen,
}: {
  post: BlogPost;
  index: number;
  onOpen: (post: BlogPost) => void;
}) {
  const handleOpen = () => {
    if (post.pdfPath) {
      openPdf(post.pdfPath);
      return;
    }

    onOpen(post);
  };

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={`card-blog-${post.slug}`}
      style={{
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: 18,
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          aspectRatio: "16 / 9",
          backgroundImage: `url(${post.thumbnail})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderBottom: "1px solid var(--belvo-border-card)",
          position: "relative",
        }}
      >
        <span
          style={{
            backdropFilter: "blur(10px)",
            background: "rgba(12,7,23,0.72)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 999,
            bottom: 12,
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.62rem",
            fontWeight: 700,
            left: 12,
            letterSpacing: "0.06em",
            padding: "5px 10px",
            position: "absolute",
            textTransform: "uppercase",
          }}
        >
          {post.category}
        </span>
      </div>

      <div style={{ padding: 23 }}>
        <h3
          style={{
            color: "var(--belvo-text-1)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.03rem",
            fontWeight: 800,
            lineHeight: 1.42,
            margin: "0 0 10px",
          }}
        >
          {post.title}
        </h3>

        <p
          style={{
            color: "var(--belvo-text-6)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.83rem",
            lineHeight: 1.68,
            margin: "0 0 18px",
          }}
        >
          {post.excerpt}
        </p>

        <span
          style={{
            alignItems: "center",
            color: "#b87cff",
            display: "inline-flex",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.73rem",
            fontWeight: 700,
            gap: 7,
          }}
        >
          {post.pdfPath ? "Open stage PDF" : "Read article"}{" "}
          <ArrowRight size={14} />
        </span>
      </div>
    </motion.article>
  );
}

function CaseStudyCard({
  study,
  index,
}: {
  study: CaseStudy;
  index: number;
}) {
  const handleOpen = () => openPdf(study.pdfPath);

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={`card-case-study-${study.slug}`}
      style={{
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: 18,
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          aspectRatio: "4 / 3",
          background: "#f7f3f8",
          borderBottom: "1px solid var(--belvo-border-card)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={study.cover}
          alt={`${study.title} case study cover`}
          loading="lazy"
          style={{
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            opacity: 1,
            width: "100%",
          }}
        />

        <span
          style={{
            backdropFilter: "blur(10px)",
            background: "rgba(12,7,23,0.76)",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 999,
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.62rem",
            fontWeight: 800,
            left: 12,
            letterSpacing: "0.08em",
            padding: "6px 10px",
            position: "absolute",
            top: 12,
          }}
        >
          {String(study.sequence).padStart(2, "0")}
        </span>
      </div>

      <div style={{ padding: 22 }}>
        <span
          style={{
            color: "#b87cff",
            display: "block",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.62rem",
            fontWeight: 750,
            letterSpacing: "0.08em",
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          {study.focus}
        </span>

        <h3
          style={{
            color: "var(--belvo-text-1)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.08rem",
            fontWeight: 820,
            margin: "0 0 10px",
          }}
        >
          {study.title}
        </h3>

        <p
          style={{
            color: "var(--belvo-text-6)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.82rem",
            lineHeight: 1.65,
            margin: "0 0 18px",
          }}
        >
          {study.excerpt}
        </p>

        <span
          style={{
            alignItems: "center",
            color: "#b87cff",
            display: "inline-flex",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.73rem",
            fontWeight: 700,
            gap: 7,
          }}
        >
          Open case study PDF <ArrowRight size={14} />
        </span>
      </div>
    </motion.article>
  );
}

export default function Blogs() {
  const contentRef = useRef<HTMLElement | null>(null);

  const contentInView = useInView(contentRef, {
    once: true,
    margin: "-80px",
  });

  const [activeResource, setActiveResource] =
    useState<ResourceType>("blogs");

  const [selectedPost, setSelectedPost] =
    useState<BlogPost | null>(null);

  const genZSlugs = [
    "gen-z-website-is-giving-2016",
    "gen-z-seo-isnt-dead",
    "gen-z-nobody-wants-your-logo",
  ];

  const genZPosts = blogPosts
    .filter((post) => genZSlugs.includes(post.slug))
    .sort((a, b) => {
      return genZSlugs.indexOf(a.slug) - genZSlugs.indexOf(b.slug);
    });

  const earlierPosts = blogPosts.filter(
    (post) =>
      post.category !== "Startup Playbook" &&
      !genZSlugs.includes(post.slug),
  );

  const startupPosts = blogPosts
    .filter((post) => post.category === "Startup Playbook")
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const getPillarArticle = (
    pillarNumber: string,
  ): BlogPost | null => {
    if (pillarNumber === "04") {
      return employmentPerksNewsletter;
    }

    if (pillarNumber === "06") {
      return teamBelvoNewsletter;
    }

    return null;
  };

  const handleResourceSelect = (resource: ResourceType) => {
    setActiveResource(resource);

    window.requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <>
      {/* HERO */}

      <section
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 18% 20%, rgba(255,154,201,0.16), transparent 28%), radial-gradient(circle at 82% 30%, rgba(157,78,221,0.34), transparent 30%), linear-gradient(145deg, #0a0512 0%, #1b0b30 52%, #08050e 100%)",
          display: "flex",
          justifyContent: "center",
          minHeight: "68vh",
          overflow: "hidden",
          padding: "132px 24px 92px",
          position: "relative",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.22) 0.7px, transparent 0.7px)",
            backgroundSize: "28px 28px",
            inset: 0,
            maskImage:
              "linear-gradient(to bottom, black, transparent 82%)",
            opacity: 0.22,
            pointerEvents: "none",
            position: "absolute",
          }}
        />

        <div
          style={{
            maxWidth: 840,
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              alignItems: "center",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 999,
              color: "rgba(255,255,255,0.78)",
              display: "inline-flex",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.67rem",
              fontWeight: 700,
              gap: 8,
              letterSpacing: "0.2em",
              marginBottom: 24,
              padding: "8px 15px",
              textTransform: "uppercase",
            }}
          >
            <FolderKanban size={13} /> Belvo knowledge hub
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            style={{
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(2.7rem, 7vw, 6rem)",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 0.98,
              margin: "0 0 22px",
            }}
          >
            Ideas, stories &amp;
            <span
              style={{
                background:
                  "linear-gradient(90deg, #c794ff, #ffb4d5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {" "}
              proof.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            style={{
              color: "rgba(255,255,255,0.67)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.94rem, 1.8vw, 1.1rem)",
              lineHeight: 1.75,
              margin: "0 auto",
              maxWidth: 650,
            }}
          >
            Explore Belvo's blogs, recurring newsletters, and client
            case studies from one focused resource page.
          </motion.p>
        </div>
      </section>

      {/* RESOURCE SELECTOR */}

      <section
        style={{
          background: "var(--belvo-bg)",
          padding: "78px 24px 36px",
          position: "relative",
        }}
      >
        <div style={{ margin: "0 auto", maxWidth: 1180 }}>
          <div style={{ marginBottom: 34, maxWidth: 650 }}>
            <span
              style={{
                color: "#b87cff",
                display: "block",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.66rem",
                fontWeight: 750,
                letterSpacing: "0.22em",
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              Top pickups from each section
            </span>

            <h2
              style={{
                color: "var(--belvo-text-1)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(1.85rem, 4vw, 3.1rem)",
                fontWeight: 880,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                margin: 0,
              }}
            >
              One page. Three useful libraries.
            </h2>
          </div>

          <ResourceSelector
            activeResource={activeResource}
            onSelect={handleResourceSelect}
          />
        </div>
      </section>

      {/* CONTENT */}

      <section
        ref={contentRef}
        id="resource-content"
        style={{
          background: "var(--belvo-bg)",
          padding: "74px 24px 118px",
          position: "relative",
        }}
      >
        <div style={{ margin: "0 auto", maxWidth: 1180 }}>
          {/* BLOGS */}

          {activeResource === "blogs" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: contentInView ? 1 : 0 }}
            >
              <div style={{ marginBottom: 38, maxWidth: 720 }}>
                <span
                  style={{
                    alignItems: "center",
                    color: "#b87cff",
                    display: "inline-flex",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.66rem",
                    fontWeight: 750,
                    gap: 8,
                    letterSpacing: "0.2em",
                    marginBottom: 13,
                    textTransform: "uppercase",
                  }}
                >
                  <Sparkles size={13} /> Gen Z trial series
                </span>

                <h2
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    fontWeight: 880,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    margin: "0 0 13px",
                  }}
                >
                  Fresh thinking, without the corporate fog.
                </h2>

                <p
                  style={{
                    color: "var(--belvo-text-6)",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.72,
                    margin: 0,
                    maxWidth: 630,
                  }}
                >
                  The first three posts test a playful but professional
                  voice before the full series is expanded.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 20,
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
                }}
              >
                {genZPosts.map((post, index) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    index={index}
                    onOpen={setSelectedPost}
                  />
                ))}
              </div>

              <div style={{ marginTop: 68 }}>
                <span
                  style={{
                    color: "#b87cff",
                    display: "block",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.66rem",
                    fontWeight: 750,
                    letterSpacing: "0.2em",
                    marginBottom: 11,
                    textTransform: "uppercase",
                  }}
                >
                  From the archive
                </span>

                <h3
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.45rem, 3vw, 2.2rem)",
                    fontWeight: 850,
                    letterSpacing: "-0.03em",
                    margin: "0 0 25px",
                  }}
                >
                  Earlier Belvo blogs
                </h3>

                <div
                  style={{
                    display: "grid",
                    gap: 20,
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
                  }}
                >
                  {earlierPosts.map((post, index) => (
                    <BlogCard
                      key={post.slug}
                      post={post}
                      index={index}
                      onOpen={setSelectedPost}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* NEWSLETTERS */}

          {activeResource === "newsletters" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ marginBottom: 38, maxWidth: 760 }}>
                <span
                  style={{
                    alignItems: "center",
                    color: "#b87cff",
                    display: "inline-flex",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.66rem",
                    fontWeight: 750,
                    gap: 8,
                    letterSpacing: "0.2em",
                    marginBottom: 13,
                    textTransform: "uppercase",
                  }}
                >
                  <CalendarDays size={13} /> Newsletter framework
                </span>

                <h2
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    fontWeight: 880,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    margin: "0 0 13px",
                  }}
                >
                  Six pillars. One consistent point of view.
                </h2>

                <p
                  style={{
                    color: "var(--belvo-text-6)",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.72,
                    margin: 0,
                  }}
                >
                  The startup playbook leads the calendar while Belvo's
                  client, culture, growth, and team stories build the
                  wider series.
                </p>
              </div>

              {/* LATEST NEWSLETTER */}

              <div style={{ marginBottom: 58 }}>
                <span
                  style={{
                    color: "#b87cff",
                    display: "block",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.66rem",
                    fontWeight: 750,
                    letterSpacing: "0.2em",
                    marginBottom: 11,
                    textTransform: "uppercase",
                  }}
                >
                  Latest newsletter
                </span>

                <h3
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.45rem, 3vw, 2.2rem)",
                    fontWeight: 850,
                    letterSpacing: "-0.03em",
                    margin: "0 0 24px",
                  }}
                >
                  A complete Gen Z workplace
                </h3>

                <div style={{ maxWidth: 520 }}>
                  <BlogCard
                    post={workplaceNewsletter}
                    index={0}
                    onOpen={setSelectedPost}
                  />
                </div>
              </div>

              {/* NEWSLETTER PILLARS */}

              <div
                style={{
                  display: "grid",
                  gap: 15,
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
                  marginBottom: 58,
                }}
              >
                {newsletterPillars.map((pillar, index) => {
                  const pillarArticle = getPillarArticle(pillar.number);

                  return (
                    <motion.article
                      key={pillar.number}
                      custom={index}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      onClick={() => {
                        if (pillarArticle) {
                          setSelectedPost(pillarArticle);
                        }
                      }}
                      onKeyDown={(event) => {
                        if (
                          pillarArticle &&
                          (event.key === "Enter" ||
                            event.key === " ")
                        ) {
                          event.preventDefault();
                          setSelectedPost(pillarArticle);
                        }
                      }}
                      role={pillarArticle ? "button" : undefined}
                      tabIndex={pillarArticle ? 0 : undefined}
                      whileHover={
                        pillarArticle ? { y: -5 } : undefined
                      }
                      style={{
                        background:
                          pillar.number === "02"
                            ? "linear-gradient(145deg, rgba(157,78,221,0.17), rgba(255,154,201,0.06))"
                            : "var(--belvo-bg-card)",
                        border:
                          pillar.number === "02"
                            ? "1px solid rgba(157,78,221,0.46)"
                            : "1px solid var(--belvo-border-card)",
                        borderRadius: 18,
                        cursor: pillarArticle
                          ? "pointer"
                          : "default",
                        minHeight: 225,
                        padding: 24,
                      }}
                    >
                      <div
                        style={{
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 30,
                        }}
                      >
                        <span
                          style={{
                            color: "rgba(184,124,255,0.72)",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            letterSpacing: "0.12em",
                          }}
                        >
                          {pillar.number}
                        </span>

                        <span
                          style={{
                            background: "rgba(157,78,221,0.1)",
                            border:
                              "1px solid rgba(157,78,221,0.2)",
                            borderRadius: 999,
                            color: "var(--belvo-text-2)",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.62rem",
                            fontWeight: 650,
                            padding: "5px 9px",
                          }}
                        >
                          {pillar.label}
                        </span>
                      </div>

                      <h3
                        style={{
                          color: "var(--belvo-text-1)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "1.03rem",
                          fontWeight: 800,
                          lineHeight: 1.42,
                          margin: "0 0 10px",
                        }}
                      >
                        {pillar.title}
                      </h3>

                      <p
                        style={{
                          color: "var(--belvo-text-6)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.82rem",
                          lineHeight: 1.68,
                          margin: pillarArticle
                            ? "0 0 18px"
                            : 0,
                        }}
                      >
                        {pillar.description}
                      </p>

                      {pillarArticle && (
                        <span
                          style={{
                            alignItems: "center",
                            color: "#b87cff",
                            display: "inline-flex",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.73rem",
                            fontWeight: 700,
                            gap: 7,
                          }}
                        >
                          Read article <ArrowRight size={14} />
                        </span>
                      )}
                    </motion.article>
                  );
                })}
              </div>

              {/* STARTUP PLAYBOOK */}

              <div
                style={{
                  alignItems: "flex-end",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 18,
                  justifyContent: "space-between",
                  marginBottom: 26,
                }}
              >
                <div style={{ maxWidth: 700 }}>
                  <span
                    style={{
                      color: "#b87cff",
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.66rem",
                      fontWeight: 750,
                      letterSpacing: "0.2em",
                      marginBottom: 11,
                      textTransform: "uppercase",
                    }}
                  >
                    Complete founder series
                  </span>

                  <h3
                    style={{
                      color: "var(--belvo-text-1)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(1.45rem, 3vw, 2.2rem)",
                      fontWeight: 850,
                      letterSpacing: "-0.03em",
                      margin: 0,
                    }}
                  >
                    Start a Company From Scratch
                  </h3>
                </div>

                <span
                  style={{
                    alignItems: "center",
                    color: "var(--belvo-text-2)",
                    display: "inline-flex",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.73rem",
                    gap: 7,
                  }}
                >
                  <CheckCircle2 color="#b87cff" size={15} /> All 9
                  stages ready
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 20,
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
                }}
              >
                {startupPosts.map((post, index) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    index={index}
                    onOpen={setSelectedPost}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* CASE STUDIES */}

          {activeResource === "case-studies" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ marginBottom: 38, maxWidth: 760 }}>
                <span
                  style={{
                    alignItems: "center",
                    color: "#b87cff",
                    display: "inline-flex",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.66rem",
                    fontWeight: 750,
                    gap: 8,
                    letterSpacing: "0.2em",
                    marginBottom: 13,
                    textTransform: "uppercase",
                  }}
                >
                  <BriefcaseBusiness size={13} /> Case study library
                </span>

                <h2
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    fontWeight: 880,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    margin: "0 0 13px",
                  }}
                >
                  Real work, explained clearly.
                </h2>

                <p
                  style={{
                    color: "var(--belvo-text-6)",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.72,
                    margin: 0,
                  }}
                >
                  Each client story is an evergreen resource focused on
                  the problem, Belvo's response, and the measurable
                  outcome.
                </p>
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(145deg, rgba(157,78,221,0.12), rgba(255,154,201,0.045))",
                  border: "1px solid rgba(157,78,221,0.28)",
                  borderRadius: 24,
                  overflow: "hidden",
                  padding: "clamp(26px, 5vw, 46px)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: 16,
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                  }}
                >
                  {caseStudySteps.map((step, index) => (
                    <div
                      key={step.title}
                      style={{
                        background: "var(--belvo-bg-card)",
                        border:
                          "1px solid var(--belvo-border-card)",
                        borderRadius: 16,
                        minHeight: 185,
                        padding: 22,
                      }}
                    >
                      <span
                        style={{
                          alignItems: "center",
                          background: "rgba(157,78,221,0.12)",
                          borderRadius: 10,
                          color: "#b87cff",
                          display: "flex",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          height: 34,
                          justifyContent: "center",
                          marginBottom: 22,
                          width: 34,
                        }}
                      >
                        {index + 1}
                      </span>

                      <h3
                        style={{
                          color: "var(--belvo-text-1)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "1rem",
                          fontWeight: 800,
                          margin: "0 0 9px",
                        }}
                      >
                        {step.title}
                      </h3>

                      <p
                        style={{
                          color: "var(--belvo-text-6)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.81rem",
                          lineHeight: 1.67,
                          margin: 0,
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    alignItems: "center",
                    borderTop:
                      "1px solid rgba(157,78,221,0.18)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    justifyContent: "space-between",
                    marginTop: 30,
                    paddingTop: 26,
                  }}
                >
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        alignItems: "center",
                        background: "rgba(157,78,221,0.12)",
                        borderRadius: 12,
                        color: "#b87cff",
                        display: "flex",
                        height: 42,
                        justifyContent: "center",
                        width: 42,
                      }}
                    >
                      <FileText size={19} />
                    </div>

                    <div>
                      <strong
                        style={{
                          color: "var(--belvo-text-1)",
                          display: "block",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.86rem",
                        }}
                      >
                        14 reviewed case studies
                      </strong>

                      <span
                        style={{
                          color: "var(--belvo-text-6)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.73rem",
                        }}
                      >
                        Open any card below to read the complete case
                        study PDF.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 48 }}>
                <div
                  style={{
                    alignItems: "flex-end",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    justifyContent: "space-between",
                    marginBottom: 25,
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#b87cff",
                        display: "block",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.66rem",
                        fontWeight: 750,
                        letterSpacing: "0.2em",
                        marginBottom: 10,
                        textTransform: "uppercase",
                      }}
                    >
                      In the supplied sequence
                    </span>

                    <h3
                      style={{
                        color: "var(--belvo-text-1)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "clamp(1.45rem, 3vw, 2.2rem)",
                        fontWeight: 850,
                        letterSpacing: "-0.03em",
                        margin: 0,
                      }}
                    >
                      Client case studies
                    </h3>
                  </div>

                  <span
                    style={{
                      color: "var(--belvo-text-2)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.73rem",
                    }}
                  >
                    Ordered as supplied
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 20,
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
                  }}
                >
                  {caseStudies.map((study, index) => (
                    <CaseStudyCard
                      key={study.slug}
                      study={study}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ARTICLE DIALOG */}

      <Dialog
        open={Boolean(selectedPost)}
        onOpenChange={(open) => {
          if (!open) setSelectedPost(null);
        }}
      >
        <DialogContent
          style={{
            background: "var(--belvo-bg-card)",
            border: "1px solid rgba(157,78,221,0.24)",
            borderRadius: 22,
            boxShadow: "0 24px 80px rgba(0,0,0,0.36)",
            maxHeight: "88vh",
            maxWidth: 900,
            overflowY: "auto",
            padding: 0,
            width: "min(92vw, 900px)",
          }}
        >
          {selectedPost && (
            <div>
              <div
                style={{
                  aspectRatio: "16 / 7",
                  backgroundImage: `url(${selectedPost.thumbnail})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  borderBottom:
                    "1px solid var(--belvo-border-card)",
                }}
              />

              <div
                style={{
                  padding:
                    "28px clamp(22px, 5vw, 42px) 38px",
                }}
              >
                <DialogHeader style={{ marginBottom: 22 }}>
                  <DialogTitle
                    style={{
                      color: "var(--belvo-text-1)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(1.35rem, 3vw, 2rem)",
                      fontWeight: 850,
                      lineHeight: 1.25,
                    }}
                  >
                    {selectedPost.title}
                  </DialogTitle>

                  <DialogDescription
                    style={{
                      alignItems: "center",
                      color: "var(--belvo-text-2)",
                      display: "flex",
                      flexWrap: "wrap",
                      fontFamily: "'Inter', sans-serif",
                      gap: 8,
                    }}
                  >
                    <span>{selectedPost.category}</span>
                    <span aria-hidden="true">•</span>
                    <span>{selectedPost.date}</span>
                  </DialogDescription>
                </DialogHeader>

                <div>
                  {renderBlogContent(selectedPost.content)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}