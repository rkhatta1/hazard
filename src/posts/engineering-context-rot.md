id: 'making-agents-forget',
title: 'The Fine Art of Making Agents Forget',
date: 'Feb 05, 2026',
readTime: '8 min read',
excerpt: 'Why 1M token windows are a trap, and how to build "amnesiac" agents that actually get things done.',
image: '/blogs/IMG_3117.webp'

---

Let's talk about the elephant in the room: **Context Windows.**

For the past year, the AI hype cycle has been obsessed with size. "200k tokens!" "500k!" "Gemini 3 Pro with 1 million tokens!" It sounds great on paper. In practice? It's a trap.

The reality is that context isn't free. I'm not just talking about cost or latency—I'm talking about **Context Rot**.

## The Hoax of the Million-Token Window

We've all seen the charts. "Needle in a haystack" benchmarks showing 99% retrieval accuracy. But try building a real software engineering agent that lives in a 1M token context for three days.

It starts hallucinating. It forgets the file it just edited. It re-imports libraries you deleted 40 messages ago. The "degradation in performance" is significant even with less than 25% of the context window filled.

Why? Because LLMs are attention machines, and when you give them everything, they pay attention to nothing.

**More context = More noise.**

## The Solution: Engineering Context Hygiene

Instead of shoving the entire repository and every conversation history into the prompt, we need to architect systems that are *intentionally amnesiac*. We need to fight **Context Rot**—the inevitable decay of model performance as irrelevant information accumulates.

Today, we're diving into two architectural patterns that solve this: **File System Context Mapping** (inspired by the [`planning-with-files`](https://github.com/OthmanAdi/planning-with-files) concept) and **Task Isolation** (the [`get-shit-done`](https://github.com/glittercowboy/get-shit-done) approach).

### 1. The File System Context Map (`planning-with-files`)

Most agents try to "read" the codebase by dumping file contents into the context. That's inefficient.

The [`planning-with-files`](https://github.com/OthmanAdi/planning-with-files) approach treats the file system like a map. Instead of reading the *content* of every file, the agent initially only sees the *structure*.

```typescript
// A simplified Context Map
const generateContextMap = async (dir: string) => {
  const tree = await getFileTree(dir);
  // The agent sees this, not the code:
  // src/
  // ├── components/
  // │   ├── Button.tsx  (UI Primitive)
  // │   └── Header.tsx  (Layout)
  // └── utils/
  //     └── api.ts      (Data Fetching)
  return tree;
};
```

The agent uses this map to *plan* its navigation. It only "opens" (reads) the specific files relevant to the current task. This keeps the context window pristine.

### 2. The Task Isolator (`get-shit-done`)

The second piece of the puzzle is the [`get-shit-done`](https://github.com/glittercowboy/get-shit-done) pattern. This relies on an **Orchestrator Pattern** to rigorously enforce "single responsibility" in agent sessions.

Instead of one giant "God Mode" agent, we have a central "Manager" (Orchestrator). The Orchestrator holds the high-level roadmap and state files (`ROADMAP.md`, `STATE.md`) but *never touches the code itself*.

The workflow is a pipeline of specialized, ephemeral agents:
1.  **Researcher:** Spawns to investigate the domain/stack.
2.  **Planner:** Creates atomic, XML-structured plans for a single phase.
3.  **Executor:** Spawns in "waves" (parallel if possible) to execute each plan.
4.  **Verifier:** Checks the work against the requirements.

Each of these sub-agents is born with zero baggage, performs its specific duty, reports back to the Orchestrator, and then *dies*.

```typescript
class Orchestrator {
  async executePhase(phase: Phase) {
    // 1. Research & Plan (Specialized Agents)
    const research = await this.spawnAgent('researcher', phase);
    const plans = await this.spawnAgent('planner', phase, research);

    // 2. Execute Plans (Fresh Context per Plan)
    await Promise.all(plans.map(async (plan) => {
      const executor = new SubAgent(); 
      await executor.execute(plan);
      // Context dies here. No rot accumulates.
    }));

    // 3. Verify & Update State
    await this.spawnAgent('verifier', phase);
    this.updateRoadmap();
  }
}
```

This ensures the central context never rots, because the heavy lifting is done in disposable, isolated containers. We explicitly **clear the context** between phases and tasks.

## Combining the Architectures

When you combine `planning-with-files` (the map) with `get-shit-done` (the purge), you get an **Agent X** system: a lightweight, surgical instrument rather than a blunt object.

The agent enters a repo, sees the map, navigates to the exact location, fixes the issue, and then *forgets* the details of that file before moving to the next.

This mimics how human seniors work. We don't memorize the entire codebase. We know *where* things are, we load them into our short-term RAM to work, and then we dump them to move on.

## Conclusion

Stop chasing context size. Start engineering context quality.

The best agents of 2026 won't be the ones with the biggest memories. They'll be the ones that know exactly what to forget.
