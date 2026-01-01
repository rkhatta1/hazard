id: 'gitfi',
title: 'The best way to write flawless git commit messages',
date: 'Dec 31, 2025',
readTime: '6 min read',
excerpt: 'Using LLM's to automate the mundane git commands.',
image: '/blogs/gitfi.webp'

---

Let's be honest; no one likes writing git commit messages, let alone writing good ones. Myself included. And if you're anything like me, you'd rather spend countless hours to automate the chore, than spend seconds to do it yourself. Well luckily, I automated git commit messages for you.

## Drop the sauce already

What do you get if you build an orchestrator on top of git commands and an LLM? You probably get a lazy programmer. You also end up with **[GitFi](https://www.npmjs.com/package/gitfi)**.

GitFi, or Git Fixed-It, is a cli tool that automates the chore that is writing commit messages.

### Okay, but how do I use it?

Fortunately, it is an npm package. So, installing it is as simple as running:

```bash
npm install -g gitfi
```

And voila! you're almost ready to go. The next thing you need to do is set up the **API key for gemini**. Currently the tool only supports gemini as the family of models. There's multiple ways to provide the key depending on your workflow and the nature of your projects. Here's the options in descending order of precedence:

1.  An `.env` file in your project's root (`GEMINI_API_KEY=...`).
2.  A global config file at `~/.config/gitfi/.gitfi.conf` (Linux) or `~/Library/Preferences/gitfi/.gitfi.conf` (macOS).
3.  A local `.gitfi.conf` file in your project's root.

With that, you're done.

### Gotcha. How do I trigger it though?

GitFi is essentially a replacement for the ```git commit``` command. So, naturally, it should be used just like you would use the git commit command. With that out of the way, there's two ways to use it:

```bash
# Non-interactive
gitfi c
```

- The fastest way to use gitfi is with the **commit** or **c** argument. It takes the diff of ```HEAD && HEAD - 1```, and prompts gemini to write a commit message for the given diff. It grabs the **response** from gemini and executes ```git commit -m "{response}"``` in your project.

```bash
# Interactive
gitfi g
```

- The **g** or **gen** argument is for when you need more granular control over the commit message before it is executed. It still prompts gemini for the commit message, but doesn't execute the git command straight away. Instead, it opens up a cli tool that looks like this:

    ```bash
    Fetching staged changes... ⌛️
    Sending diff to AI for generating the commit message... 🤖

    ✓ AI-generated commit message:
    ---------------------------------
    feat: Introduce new GitFi blog post, clear out old filler content
    ---------------------------------
    ? What would you like to do? (Use arrow keys)
    ❯ Commit
    Edit
    ──────────────
    Cancel
    ```

- You then, have three options:
    1. execute the commit with the generated message.
    2. edit the message.
    3. exit the cli tool.

And that's about it. Quick, simple and straight-forward.

### Noted. But the commit messages must be so jargony...

You're right in thinking that. GitFi however, has a trick up its sleeve. In the `.gitfi.conf` file (and even the **.env** file) you could set this variable:

```env
PROMPT="You're a pirate. Write a git commit message for this treasure map:"
```

The **PROMPT** variable is essentially a way to set the system prompt of the LLM as you may seem fit. So, you could make it write verbose messages, concise messages, quirky messages. Anything that you may fancy, really.

> By default the tool is instructed to be concise, yet exhaustive, and follow this structure: `<type>[optional scope]: <description>`.

## It's cool and all, but I'm pretty fast with my commit messages...

And that is exactly the reason why the tool chose gemini as its choice of LLM. **Google, unlike other AI labs, is fully vertically integrated with its AI suite.** And that plays a huge factor in the "speed" of their models over their API's.

Google is the only frontier AI lab that uses their own silicon for training and inferring their models. It's called a [TPU  (Tensor Processing Unit)](https://cloud.google.com/tpu?hl=en). TL;DR these TPU's are a proprietary product that is bespoke to Google's data-centres and its various departments such as Vertex, Google Cloud, Google DeepMind etc.

Because of this proprietary technology, Gemini's **"flash"** series of models is extremely intelligent and incredibly fast in its **tps (tokens per second)** output, making it the best choice for our purpose here.

Moreover, if you want to measure the speed metrics while using **gitfi**, you could include the `-m` flag. It will add the duration metrics at the end of commit messages as well, so you can compare the **manual vs gitfi** durations.