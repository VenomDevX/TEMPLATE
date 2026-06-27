const promptData = {
  payments: {
    prompt: "Why is the Payments API release delayed?",
    answer:
      "Release 3.8.0 is delayed by two blocked backend tasks, one failed regression test, and a pending security approval.",
    permission: "Permission verified",
    audit: "Audit logging enabled",
    sources: [
      ["Task", "PAY-4421 Backend reconciliation blocker"],
      ["Project", "Payments API Release 3.8.0"],
      ["Document", "Security approval checklist"],
      ["Pull request", "PR #1847 Regression suite update"],
    ],
  },
  sprint: {
    prompt: "Summarize Sprint 14.",
    answer:
      "Sprint 14 closed 31 of 38 committed tasks, carried over three integration items, and reduced open release blockers from seven to four.",
    permission: "Permission verified",
    audit: "Audit logging enabled",
    sources: [
      ["Project", "Core Platform Sprint 14"],
      ["Task", "Sprint board completed work"],
      ["Document", "Sprint review notes"],
      ["Pull request", "Merged PRs for Sprint 14"],
    ],
  },
  deployment: {
    prompt: "Why did deployment 3.8.0 fail?",
    answer:
      "Deployment 3.8.0 failed after the regression workflow detected an auth callback timeout and the release gate held the rollout for review.",
    permission: "Permission verified",
    audit: "Audit logging enabled",
    sources: [
      ["Task", "REL-3098 Deployment investigation"],
      ["Project", "Payments Platform release train"],
      ["Document", "Release gate policy"],
      ["Pull request", "PR #1852 Auth callback patch"],
    ],
  },
  capacity: {
    prompt: "Which engineers are above planned capacity?",
    answer:
      "Three backend engineers are above planned capacity this week because urgent incident work was added after sprint planning.",
    permission: "Permission verified",
    audit: "Audit logging enabled",
    sources: [
      ["Project", "Platform staffing plan"],
      ["Task", "Incident follow-up queue"],
      ["Document", "Sprint capacity assumptions"],
      ["Pull request", "Open review queue"],
    ],
  },
};

const promptInput = document.querySelector("#aiPrompt");
const answerText = document.querySelector("#answerText");
const sourceList = document.querySelector("#sourceList");
const permissionStatus = document.querySelector("#permissionStatus");
const auditNotice = document.querySelector("#auditNotice");
const promptButtons = document.querySelectorAll("[data-prompt]");
const askButton = document.querySelector("#askButton");

function renderPrompt(key) {
  const data = promptData[key];
  if (!data) return;

  promptInput.value = data.prompt;
  answerText.textContent = data.answer;
  permissionStatus.textContent = data.permission;
  auditNotice.textContent = data.audit;
  sourceList.replaceChildren(
    ...data.sources.map(([type, text]) => {
      const item = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = type;
      item.append(label, document.createTextNode(text));
      return item;
    })
  );

  promptButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.prompt === key);
  });
}

promptButtons.forEach((button) => {
  button.addEventListener("click", () => renderPrompt(button.dataset.prompt));
});

askButton.addEventListener("click", () => {
  askButton.textContent = "Logged";
  setTimeout(() => {
    askButton.textContent = "Ask";
  }, 900);
});

renderPrompt("payments");
