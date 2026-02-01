---
id: 'my-personal-portfolio-admin'
title: 'My Personal Portfolio Admin: Or, What We Call OpenClaw This Week'
date: 'Feb 01, 2026'
readTime: '3 min read'
excerpt: "I've automated my blog workflow using OpenClaw, Docker, and Wispr Flow. Here's how I turned my messy voice notes into published posts without touching a keyboard."
image: '/blogs/IMG_1705.webp'
---

Let’s address the elephant in the room: OpenClaw has had more names than I’ve had hot dinners recently. But frankly, that’s more of a feature than a bug at this point—keeps us all on our toes.

Jokes aside, I wanted to walk through this current setup I’m running. I’ve essentially turned OpenClaw into my own personal portfolio admin. It’s not just a chatbot anymore; it’s the engine room of this website.

## Why use OpenClaw?

Look, letting an autonomous agent run loose on your infrastructure is usually the digital equivalent of handing a toddler a chainsaw. It’s fun for about four seconds, and then it’s a disaster.

This is exactly why I’m betting on OpenClaw. The architecture is robust. It’s designed with the understanding that AI agents can be... enthusiastic. OpenClaw ships with guardrails that make it safe to be effective. It’s not just about raw capability; it’s about *constrained* capability.

Plus, you’ve seen the internet lately. The rage around OpenClaw is real, and honestly, the usage patterns emerging are fascinating. I figured I’d stop watching from the sidelines and actually put it to work.

## How do we stop OpenClaw from going haywire?

"Great," you say, "you gave the robot write access to your website."

Relax. We aren't doing this blindly. We’ve built a few layers of defense to keep things sane:

1.  **Containerization:** The whole thing runs in a **Docker container**. If it decides to delete the filesystem, it’s deleting a disposable box, not my actual server.
2.  **Scripted Interactions:** I’m not giving it `sudo` and a prayer. Interactions are handled via specific scripts (like the ones moving images or handling Git operations). It has a menu, not a command line.
3.  **No Persistent Keys:** We aren't sharing SSH keys or root passwords. We rely on fine-grained Git access tokens. Scope is everything.

## What's the catch?

Is there one? Writing blogs isn't exactly climbing Everest.

But here’s the cool part: **I’m not typing this.**

I’m using **Wispr Flow** on my phone. I could be walking down the street, sitting in a cafe, or lying on the couch. I ramble my thoughts into the app, it transcribes them, and I send them over via WhatsApp (or Discord).

OpenClaw takes that raw stream of consciousness—my "ums," my "ahs," and my unstructured ideas—and formats it into the Markdown file you’re reading right now. I don't worry about headers, bold text, or file paths. I just blurting out thoughts, and the system handles the structure and publishing.

I don't need my computer. I just need signal.

## The Vision

This is just step one. The ultimate goal is to chain this into a fully automated content machine.

Imagine this: I dictate a blog post -> OpenClaw publishes it here -> A subsequent agent picks up that new URL -> reads the content -> drafts a LinkedIn post -> and hits publish on LinkedIn.

One voice note triggers a cascade across platforms. That’s the dream. But for now, I’m just happy I didn’t have to type this out.
