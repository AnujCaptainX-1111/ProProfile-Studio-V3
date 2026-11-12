/**
 * ==============================================================================
 * PROPROFILE AI SAAS STUDIO - CLIENT APPLICATION LOGIC (script.js)
 * ==============================================================================
 * Enterprise AI LinkedIn Profile Generator with Dark Mode, View Navigation,
 * Local Profile Snapshots, Real-time Counters, and Offline Fallback.
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ============================================================================
     1. DOM ELEMENT REFERENCES (All Existing IDs Preserved + V3 Additions)
     ============================================================================ */
  const profileForm = document.getElementById("profile-form");

  // Form Inputs
  const inputFullName = document.getElementById("fullname");
  const inputRole = document.getElementById("role");
  const inputIndustry = document.getElementById("industry");
  const inputEducation = document.getElementById("education");
  const inputSkills = document.getElementById("skills");
  const inputExperience = document.getElementById("experience");
  const inputProjects = document.getElementById("projects");
  const inputAchievements = document.getElementById("achievements");
  const selectTone = document.getElementById("tone-select");

  // V3: Profile Photo Elements
  const inputProfilePhoto = document.getElementById("input-profile-photo");
  const btnUploadPhoto = document.getElementById("btn-upload-photo");
  const btnChangePhoto = document.getElementById("btn-change-photo");
  const btnRemovePhoto = document.getElementById("btn-remove-photo");
  const formPhotoPreviewBox = document.getElementById("form-photo-preview-box");
  const formPhotoImg = document.getElementById("form-photo-img");
  const photoAvatarPlaceholder = document.getElementById("photo-avatar-placeholder");
  const previewAvatar = document.getElementById("preview-avatar");
  const previewAvatarInitials = document.getElementById("preview-avatar-initials");
  const previewAvatarImg = document.getElementById("preview-avatar-img");
  const previewName = document.getElementById("preview-name");
  const previewRole = document.getElementById("preview-role");
  const previewIndustry = document.getElementById("preview-industry");

  // Engine Selectors
  const radioEngineAI = document.getElementById("engine-ai");
  const radioEngineTemplate = document.getElementById("engine-template");
  const engineAITag = document.getElementById("engine-ai-tag");

  // Form Groups
  const groupFullName = document.getElementById("group-fullname");
  const groupRole = document.getElementById("group-role");
  const groupEducation = document.getElementById("group-education");
  const groupSkills = document.getElementById("group-skills");

  // Action Buttons
  const btnLoadSample = document.getElementById("btn-load-sample");
  const btnClear = document.getElementById("btn-clear");
  const btnRegenerate = document.getElementById("btn-regenerate");
  const btnCopyAll = document.getElementById("btn-copy-all");
  const btnGenerate = document.getElementById("btn-generate");
  const generateSpinner = document.getElementById("generate-spinner");
  const generateIcon = document.getElementById("generate-icon");
  const generateBtnText = document.getElementById("generate-btn-text");

  // V3: Save & Download Profile Controls
  const btnSaveProfile = document.getElementById("btn-save-profile");
  const btnDownloadProfile = document.getElementById("btn-download-profile");
  const downloadDropdownWrap = document.querySelector(".download-dropdown-wrap");
  const downloadDropdownMenu = document.getElementById("download-dropdown-menu");
  const btnDownloadMd = document.getElementById("btn-download-md");
  const btnDownloadTxt = document.getElementById("btn-download-txt");
  const btnDownloadPdf = document.getElementById("btn-download-pdf");

  // Backend Status & Badges
  const aiStatusPill = document.getElementById("ai-status-pill");
  const aiStatusText = document.getElementById("ai-status-text");
  const sourceBadge = document.getElementById("source-badge");

  // Preview States & Skeleton
  const previewEmptyState = document.getElementById("preview-empty-state");
  const previewResults = document.getElementById("preview-results");
  const previewLoadingSkeleton = document.getElementById("preview-loading-skeleton");

  // Output Containers (6 Complete LinkedIn Sections)
  const outputHeadline = document.getElementById("output-headline");
  const outputHeadlineVar1 = document.getElementById("output-headline-variant-1");
  const outputHeadlineVar2 = document.getElementById("output-headline-variant-2");
  const outputAbout = document.getElementById("output-about");
  const outputExperience = document.getElementById("output-experience");
  const outputEducation = document.getElementById("output-education");
  const outputSkills = document.getElementById("output-skills");
  const outputProjects = document.getElementById("output-projects");
  const cardExperience = document.getElementById("card-experience");
  const cardEducation = document.getElementById("card-education");
  const cardSkills = document.getElementById("card-skills");
  const cardProjects = document.getElementById("card-projects");
  const headlineCharCount = document.getElementById("headline-char-count");
  const aboutWordCount = document.getElementById("about-word-count");

  // Toast Notification
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  let toastTimeout = null;

  // View Navigation Elements
  const navItems = document.querySelectorAll(".nav-item");
  const viewPanels = document.querySelectorAll(".view-panel");
  const currentPageCrumb = document.getElementById("current-page-crumb");
  const dashboardLaunchBtn = document.getElementById("dashboard-launch-btn");
  const brandHomeLink = document.getElementById("brand-home-link");

  // Mobile Sidebar Elements
  const appSidebar = document.getElementById("app-sidebar");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  // Theme Elements
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const settingsThemeDark = document.getElementById("settings-theme-dark");
  const settingsThemeLight = document.getElementById("settings-theme-light");

  // Dashboard & Profiles Elements
  const kpiTotalProfiles = document.getElementById("kpi-total-profiles");
  const kpiAIStatus = document.getElementById("kpi-ai-status");
  const savedProfilesCount = document.getElementById("saved-profiles-count");
  const savedProfilesGrid = document.getElementById("saved-profiles-grid");
  const profilesEmptyState = document.getElementById("profiles-empty-state");
  const btnClearSavedProfiles = document.getElementById("btn-clear-saved-profiles");

  // Application State
  let backendState = {
    connected: false,
    aiConfigured: false,
    provider: null
  };
  let regenerateCount = 0;
  let totalGenerationCount = 0;
  let currentProfilePhoto = null; // V3: Data URL for profile photo

  /* ============================================================================
     2. REALISTIC SAMPLE DATA
     ============================================================================ */
  const SAMPLE_DATA = {
    fullname: "Alex Rivera",
    role: "Full Stack Web Developer",
    industry: "SaaS & Cloud Applications",
    education: "B.S. in Computer Science | University of Washington (2020 - 2024)\nDean's Honor List for Academic Excellence",
    skills: "JavaScript (ES6+), React.js, Node.js, Express, PostgreSQL, REST APIs, HTML5/CSS3, Git & GitHub, Tailwind CSS, Docker",
    experience: "Software Engineering Intern | NexaTech Solutions (Jan 2024 - Jun 2024)\n- Built and maintained customer-facing dashboard components using React and REST APIs.\n- Improved page load speeds by 28% through code splitting and asset optimization.\n- Collaborated in an agile scrum team of 6 engineers with daily standups and code reviews.\n\nJunior Web Developer | Campus Innovation Labs (Sep 2022 - Dec 2023)\n- Developed responsive web pages for campus events serving over 8,000 active students.\n- Implemented secure student login authentication using Node.js and JWT tokens.",
    projects: "CollabTask - Real-Time Workflow Manager\n- Built a collaborative Kanban task board using React, Node.js, and WebSockets.\n- Enabled instant task synchronization across multiple user sessions.\n\nEcoTrack - Carbon Footprint Calculator\n- Designed an interactive calculator estimating household energy emissions using vanilla JavaScript and Chart.js.\n- Recognized as a finalist in the Regional Green Tech Hackathon.",
    achievements: "First Place Winner - Pacific Northwest Student Hackathon 2023\nAWS Certified Cloud Practitioner (Earned March 2024)\nDean's Honor List across 4 consecutive academic semesters",
    tone: "modern"
  };

  /* ============================================================================
     3. THEME SYSTEM (Dark Default + Light Studio)
     ============================================================================ */
  function applyTheme(themeName) {
    const root = document.documentElement;
    root.setAttribute("data-theme", themeName);
    localStorage.setItem("proprofile_theme", themeName);

    if (settingsThemeDark && settingsThemeLight) {
      if (themeName === "dark") {
        settingsThemeDark.classList.add("active");
        settingsThemeLight.classList.remove("active");
      } else {
        settingsThemeDark.classList.remove("active");
        settingsThemeLight.classList.add("active");
      }
    }
  }

  // Load saved theme or default to 'dark'
  const savedTheme = localStorage.getItem("proprofile_theme") || "dark";
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === "dark" ? "Pure Black" : "Light Studio"} mode`, "success");
    });
  }

  if (settingsThemeDark) {
    settingsThemeDark.addEventListener("click", () => {
      applyTheme("dark");
      showToast("Pure Black theme activated", "success");
    });
  }

  if (settingsThemeLight) {
    settingsThemeLight.addEventListener("click", () => {
      applyTheme("light");
      showToast("Light Studio theme activated", "success");
    });
  }

  /* ============================================================================
     4. VIEW NAVIGATION & MOBILE SIDEBAR
     ============================================================================ */
  function switchView(viewName) {
    // Update nav tabs
    navItems.forEach((btn) => {
      if (btn.getAttribute("data-view") === viewName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update panels
    viewPanels.forEach((panel) => {
      if (panel.id === `view-${viewName}`) {
        panel.classList.add("active-view");
      } else {
        panel.classList.remove("active-view");
      }
    });

    // Update breadcrumb
    const titles = {
      dashboard: "Dashboard Overview",
      generator: "Profile Generator",
      profiles: "My Saved Profiles",
      settings: "System Settings"
    };

    if (currentPageCrumb) {
      currentPageCrumb.textContent = titles[viewName] || "Profile Generator";
    }

    // Refresh view specific data
    if (viewName === "profiles") {
      renderSavedProfiles();
    } else if (viewName === "dashboard") {
      updateDashboardStats();
    }

    // Close mobile sidebar if open
    closeMobileSidebar();
  }

  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetView = btn.getAttribute("data-view");
      if (targetView) {
        switchView(targetView);
      }
    });
  });

  if (dashboardLaunchBtn) {
    dashboardLaunchBtn.addEventListener("click", () => {
      switchView("generator");
    });
  }

  if (brandHomeLink) {
    brandHomeLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("generator");
    });
  }

  // Mobile sidebar controls
  function openMobileSidebar() {
    if (appSidebar) appSidebar.classList.add("sidebar-open");
    if (sidebarOverlay) sidebarOverlay.classList.add("active");
  }

  function closeMobileSidebar() {
    if (appSidebar) appSidebar.classList.remove("sidebar-open");
    if (sidebarOverlay) sidebarOverlay.classList.remove("active");
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", openMobileSidebar);
  }
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", closeMobileSidebar);
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeMobileSidebar);
  }

  // Dashboard Role Pill Quick Action
  document.querySelectorAll(".role-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      inputRole.value = pill.textContent.trim();
      switchView("generator");
      inputRole.focus();
      showToast(`Selected "${pill.textContent.trim()}" role!`, "success");
    });
  });

  /* ============================================================================
     5. TOAST NOTIFICATION UTILITY
     ============================================================================ */
  function showToast(message, type = "success") {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastMessage.textContent = message;
    toast.className = "toast glass-panel";

    if (type === "error") {
      toast.classList.add("toast-error");
    } else if (type === "warning") {
      toast.classList.add("toast-warning");
    } else {
      toast.classList.add("toast-success");
    }

    toast.classList.add("show");

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3400);
  }

  /* ============================================================================
     6. BACKEND CONNECTION & STATUS DETECTION
     ============================================================================ */
  async function checkBackendStatus() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch("/api/status", {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Backend responded with non-200 status");
      }

      const data = await response.json();
      backendState.connected = true;
      backendState.aiConfigured = Boolean(data.aiConfigured);
      backendState.provider = data.provider;

      if (data.aiConfigured) {
        aiStatusPill.className = "status-pill status-ready";
        aiStatusText.textContent = `🟢 AI Ready (${data.provider.toUpperCase()})`;
        engineAITag.textContent = "Key Active";
        engineAITag.className = "engine-tag tag-free";
        radioEngineAI.checked = true;
        if (kpiAIStatus) kpiAIStatus.textContent = `Active (${data.provider.toUpperCase()})`;
      } else {
        aiStatusPill.className = "status-pill status-no-key";
        aiStatusText.textContent = "🟡 Template Mode (No key in .env)";
        engineAITag.textContent = "No Key in .env";
        engineAITag.className = "engine-tag";
        radioEngineTemplate.checked = true;
        if (kpiAIStatus) kpiAIStatus.textContent = "Template Fallback";
      }
    } catch {
      backendState.connected = false;
      backendState.aiConfigured = false;
      backendState.provider = null;

      aiStatusPill.className = "status-pill status-offline";
      aiStatusText.textContent = "⚡ Offline Template Mode";
      engineAITag.textContent = "Backend Offline";
      engineAITag.className = "engine-tag";
      radioEngineTemplate.checked = true;
      if (kpiAIStatus) kpiAIStatus.textContent = "Offline (Local Engine)";
    }
  }

  checkBackendStatus();

  /* ============================================================================
     7. FORM VALIDATION
     ============================================================================ */
  function validateForm() {
    let isValid = true;

    if (!inputFullName.value.trim()) {
      groupFullName.classList.add("has-error");
      isValid = false;
    } else {
      groupFullName.classList.remove("has-error");
    }

    if (!inputRole.value.trim()) {
      groupRole.classList.add("has-error");
      isValid = false;
    } else {
      groupRole.classList.remove("has-error");
    }

    if (!inputEducation.value.trim()) {
      groupEducation.classList.add("has-error");
      isValid = false;
    } else {
      groupEducation.classList.remove("has-error");
    }

    if (!inputSkills.value.trim()) {
      groupSkills.classList.add("has-error");
      isValid = false;
    } else {
      groupSkills.classList.remove("has-error");
    }

    return isValid;
  }

  // Real-time error removal
  [inputFullName, inputRole, inputEducation, inputSkills].forEach((input) => {
    input.addEventListener("input", () => {
      const parentGroup = input.closest(".form-group");
      if (parentGroup && parentGroup.classList.contains("has-error")) {
        parentGroup.classList.remove("has-error");
      }
    });
  });

  /* ============================================================================
     8. TEXT PROCESSING & TEMPLATE ENGINE
     ============================================================================ */
  function parseSkillsList(rawSkills) {
    if (!rawSkills) return [];
    return rawSkills
      .split(/[,|\n]/)
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  }

  function parseLines(rawText) {
    if (!rawText) return [];
    return rawText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  function generateHeadlines(data, skillsArray, variationIndex = 0) {
    const role = data.role.trim();
    const industry = data.industry ? data.industry.trim() : "";
    const topSkills = skillsArray.slice(0, 3).join(" | ");
    const extendedSkills = skillsArray.slice(0, 5).join(" • ");

    let primary = role;
    if (variationIndex % 2 === 0) {
      if (topSkills) primary += ` | ${topSkills}`;
      if (industry) primary += ` | Specializing in ${industry}`;
    } else {
      if (industry) primary += ` specializing in ${industry}`;
      if (topSkills) primary += ` | Core: ${topSkills}`;
    }

    const variant1 = `${role} specializing in ${extendedSkills || topSkills || "modern technologies"}`;

    let variant2 = `${role}`;
    if (industry) {
      variant2 += ` passionate about building scalable solutions in ${industry}`;
    } else if (topSkills) {
      variant2 += ` dedicated to solving complex problems with ${topSkills}`;
    } else {
      variant2 += ` | Dedicated to Continuous Learning & Practical Impact`;
    }

    return { primary, variant1, variant2 };
  }

  function generateAboutSection(data, skillsArray, tone, variationIndex = 0) {
    const name = data.fullname.trim();
    const role = data.role.trim();
    const industry = data.industry ? data.industry.trim() : "";
    const education = data.education.trim();
    const experience = data.experience.trim();
    const projects = data.projects.trim();
    const achievements = data.achievements.trim();

    const sections = [];

    // Opening Hook
    if (tone === "direct") {
      if (variationIndex % 2 === 0) {
        sections.push(
          `I am a ${role}${industry ? " operating in " + industry : ""} focused on delivering robust, reliable results and applying strong technical fundamentals to drive measurable value.`
        );
      } else {
        sections.push(
          `Results-oriented ${role}${industry ? " in " + industry : ""}, committed to technical excellence, structured problem-solving, and dependable execution.`
        );
      }
    } else if (tone === "story") {
      if (variationIndex % 2 === 0) {
        sections.push(
          `Hi, I'm ${name}! As a dedicated ${role}${industry ? " with an interest in " + industry : ""}, my journey is driven by a passion for continuous learning, problem-solving, and building high-impact solutions.`
        );
      } else {
        sections.push(
          `Hello! I'm ${name}, a ${role} focused on ${industry || "technology and innovation"}. I thrive on turning complex challenges into clean, accessible digital experiences.`
        );
      }
    } else {
      // Modern & Value-Driven
      if (variationIndex % 2 === 0) {
        sections.push(
          `I am a ${role}${industry ? " specializing in " + industry : ""}, committed to building clean, scalable solutions and contributing to collaborative, forward-thinking teams.`
        );
      } else {
        sections.push(
          `As a ${role}${industry ? " working across " + industry : ""}, I combine a strong foundational skillset with a dedication to engineering high-quality, impactful solutions.`
        );
      }
    }

    // Academic Background
    if (education) {
      const eduLines = parseLines(education);
      if (eduLines.length > 0) {
        sections.push(
          `🎓 Academic Background:\nMy technical foundation is built on ${eduLines.join(" — ")}.`
        );
      }
    }

    // Skills List
    if (skillsArray.length > 0) {
      const skillsFormatted = skillsArray.map((s) => `• ${s}`).join("\n");
      sections.push(`⚡ Core Competencies & Technical Skills:\n${skillsFormatted}`);
    }

    // Experience & Projects
    if (experience && projects) {
      sections.push(
        `💼 Experience & Applied Work:\nThroughout my career and hands-on projects, I have focused on translating requirements into clean implementations, optimizing workflows, and collaborating effectively across teams.`
      );
    } else if (experience) {
      sections.push(
        `💼 Professional Experience:\nI bring practical experience collaborating in teams, executing structured technical tasks, and continuously delivering dependable outcomes.`
      );
    } else if (projects) {
      sections.push(
        `🚀 Project Portfolio:\nThrough independent and academic projects, I actively turn theory into working code, architecting solutions that solve genuine user problems.`
      );
    }

    // Achievements
    if (achievements) {
      const achLines = parseLines(achievements).map((a) => `• ${a.replace(/^[-•*]\s*/, "")}`).join("\n");
      sections.push(`🏆 Key Highlights & Milestones:\n${achLines}`);
    }

    // Call to Action
    if (variationIndex % 2 === 0) {
      sections.push(
        `📫 Let's Connect:\nI am always interested in discussing new opportunities, exchanging ideas, and collaborating with fellow professionals in ${industry || "technology and engineering"}. Feel free to reach out directly here on LinkedIn!`
      );
    } else {
      sections.push(
        `🤝 Open to Opportunities:\nI welcome conversations regarding forward-thinking roles, team projects, and knowledge exchange in ${industry || "technology"}. Send a connection request or message to start a conversation!`
      );
    }

    return sections.join("\n\n");
  }

  function formatExperience(rawExperience) {
    if (!rawExperience.trim()) {
      return "No work experience provided yet. Add your past or current roles in the form to generate polished bullets.";
    }

    const lines = rawExperience.split("\n");
    const formatted = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        formatted.push("");
        continue;
      }

      if (trimmed.includes("|") || (!trimmed.startsWith("•") && !trimmed.startsWith("-") && !trimmed.startsWith("*"))) {
        formatted.push(`📌 ${trimmed}`);
      } else {
        const cleanedText = trimmed.replace(/^[-*•]\s*/, "");
        formatted.push(`  • ${cleanedText}`);
      }
    }

    return formatted.join("\n");
  }

  function formatEducation(rawEducation) {
    if (!rawEducation || !rawEducation.trim()) {
      return "No education background provided yet. Add your degree, certifications, or college in the form to generate structured academic highlights.";
    }

    const lines = rawEducation.split("\n");
    const formatted = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        formatted.push("");
        continue;
      }

      if (trimmed.includes("|") || (!trimmed.startsWith("•") && !trimmed.startsWith("-") && !trimmed.startsWith("*"))) {
        formatted.push(`🎓 ${trimmed}`);
      } else {
        const cleanedText = trimmed.replace(/^[-*•]\s*/, "");
        formatted.push(`  • ${cleanedText}`);
      }
    }

    return formatted.join("\n");
  }

  function formatSkills(rawSkills, skillsArray) {
    if (!rawSkills || !rawSkills.trim()) {
      return "No skills provided yet. Add your technical and professional skills in the form to generate prioritized endorsement keywords.";
    }

    if (!skillsArray || skillsArray.length === 0) {
      skillsArray = parseSkillsList(rawSkills);
    }

    const topSkills = skillsArray.slice(0, 5);
    const secondarySkills = skillsArray.slice(5);

    const sections = [
      "⚡ Core Technical Competencies (High Recruiter Demand):",
      ...topSkills.map((s) => `• ${s}`)
    ];

    if (secondarySkills.length > 0) {
      sections.push("", "🛠️ Tools, Frameworks & Methodologies:", ...secondarySkills.map((s) => `• ${s}`));
    }

    sections.push(
      "",
      "🎯 Recommended LinkedIn 50-Skills Tag List:",
      skillsArray.join("  •  ")
    );

    return sections.join("\n");
  }

  function formatProjects(rawProjects) {
    if (!rawProjects.trim()) {
      return "No projects provided yet. Add your personal, academic, or open-source projects in the form to generate project highlights.";
    }

    const lines = rawProjects.split("\n");
    const formatted = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        formatted.push("");
        continue;
      }

      if (trimmed.includes("|") || (!trimmed.startsWith("•") && !trimmed.startsWith("-") && !trimmed.startsWith("*"))) {
        formatted.push(`🚀 ${trimmed}`);
      } else {
        const cleanedText = trimmed.replace(/^[-*•]\s*/, "");
        formatted.push(`  • ${cleanedText}`);
      }
    }

    return formatted.join("\n");
  }

  function runTemplateGenerator(formData, skillsArray, isFallback = false) {
    const headlines = generateHeadlines(formData, skillsArray, regenerateCount);
    const aboutContent = generateAboutSection(formData, skillsArray, formData.tone, regenerateCount);
    const experienceContent = formatExperience(formData.experience);
    const educationContent = formatEducation(formData.education);
    const skillsContent = formatSkills(formData.skills, skillsArray);
    const projectsContent = formatProjects(formData.projects);

    renderOutputs({
      headlinePrimary: headlines.primary,
      headlineVariant1: headlines.variant1,
      headlineVariant2: headlines.variant2,
      about: aboutContent,
      experience: experienceContent,
      education: educationContent,
      skills: skillsContent,
      projects: projectsContent
    }, formData);

    if (isFallback) {
      sourceBadge.textContent = "⚡ Smart Template (Fallback)";
      sourceBadge.className = "badge badge-source badge-template";
    } else {
      sourceBadge.textContent = "⚡ Smart Template Engine";
      sourceBadge.className = "badge badge-source badge-template";
    }
    sourceBadge.classList.remove("hidden");
  }

  /* ============================================================================
     9. SECURE AI GENERATION CALL
     ============================================================================ */
  async function callAIGenerator(formData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    return await response.json();
  }

  /* ============================================================================
     10. UI RENDERER & SKELETON CONTROLS
     ============================================================================ */
  function updateCounters(headlineText, aboutText) {
    if (headlineCharCount) {
      const charCount = headlineText ? headlineText.length : 0;
      headlineCharCount.textContent = `${charCount} / 220 chars`;
      if (charCount > 220) {
        headlineCharCount.style.color = "var(--color-danger)";
      } else {
        headlineCharCount.style.color = "";
      }
    }

    if (aboutWordCount) {
      const wordCount = aboutText ? aboutText.trim().split(/\s+/).filter(Boolean).length : 0;
      const readMins = Math.max(1, Math.ceil(wordCount / 200));
      aboutWordCount.textContent = `${wordCount} words • ~${readMins} min read`;
    }
  }

  function escapePreviewText(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function renderOutputs(data, formData) {
    // Update the LinkedIn-style identity preview using candidate-supplied details.
    if (previewName) previewName.innerHTML = `${escapePreviewText(formData.fullname || "Your Name")} <span class="verified-mark">✓</span>`;
    if (previewRole) previewRole.textContent = formData.role || "Your professional role";
    if (previewIndustry) previewIndustry.textContent = formData.industry || "Professional Profile";

    // Update avatar initials (preserve photo if currently set)
    if (previewAvatarInitials) {
      const initials = (formData.fullname || "AI").trim().split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
      previewAvatarInitials.textContent = initials || "AI";
    }

    // Set all 6 section outputs
    if (outputHeadline) outputHeadline.textContent = data.headlinePrimary || "";
    if (outputHeadlineVar1) outputHeadlineVar1.textContent = data.headlineVariant1 || "";
    if (outputHeadlineVar2) outputHeadlineVar2.textContent = data.headlineVariant2 || "";
    if (outputAbout) outputAbout.textContent = data.about || "";
    if (outputExperience) outputExperience.textContent = data.experience || "";
    if (outputEducation) outputEducation.textContent = data.education || "";
    if (outputSkills) outputSkills.textContent = data.skills || "";
    if (outputProjects) outputProjects.textContent = data.projects || "";

    updateCounters(data.headlinePrimary, data.about);

    // Always show all cards after generation
    if (cardExperience) cardExperience.style.display = "block";
    if (cardProjects) cardProjects.style.display = "block";
    if (cardEducation) cardEducation.style.display = "block";
    if (cardSkills) cardSkills.style.display = "block";

    // Toggle Preview States
    previewEmptyState.classList.add("hidden");
    if (previewLoadingSkeleton) previewLoadingSkeleton.classList.add("hidden");
    previewResults.classList.remove("hidden");

    // Auto-save snapshot into localStorage
    saveProfileSnapshot(formData, data);

    totalGenerationCount++;
    updateDashboardStats();

    if (window.innerWidth < 1024) {
      previewResults.scrollIntoView({ behavior: "smooth" });
    }
  }

  function setLoading(isLoading) {
    if (isLoading) {
      btnGenerate.disabled = true;
      generateSpinner.classList.remove("hidden");
      generateIcon.classList.add("hidden");
      generateBtnText.textContent = "✨ Crafting with AI...";

      // Show Skeleton
      previewEmptyState.classList.add("hidden");
      previewResults.classList.add("hidden");
      if (previewLoadingSkeleton) previewLoadingSkeleton.classList.remove("hidden");
    } else {
      btnGenerate.disabled = false;
      generateSpinner.classList.add("hidden");
      generateIcon.classList.remove("hidden");
      generateBtnText.textContent = "Generate LinkedIn Profile";

      if (previewLoadingSkeleton) previewLoadingSkeleton.classList.add("hidden");
    }
  }

  /* ============================================================================
     11. SAVED PROFILES & LOCAL STORAGE
     ============================================================================ */
  function getSavedProfiles() {
    try {
      const raw = localStorage.getItem("proprofile_saved_profiles");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveProfileSnapshot(formData, outputData) {
    try {
      const profiles = getSavedProfiles();
      const newEntry = {
        id: "profile_" + Date.now(),
        date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        name: formData.fullname,
        role: formData.role,
        industry: formData.industry,
        tone: formData.tone,
        formData: formData,
        outputData: outputData
      };

      // Keep latest 12 profiles
      profiles.unshift(newEntry);
      if (profiles.length > 12) profiles.pop();

      localStorage.setItem("proprofile_saved_profiles", JSON.stringify(profiles));
      updateSavedProfilesBadge();
    } catch (e) {
      console.warn("Could not save profile snapshot:", e);
    }
  }

  function updateSavedProfilesBadge() {
    const list = getSavedProfiles();
    if (savedProfilesCount) {
      savedProfilesCount.textContent = list.length;
    }
    if (kpiTotalProfiles) {
      kpiTotalProfiles.textContent = list.length;
    }
  }

  function renderSavedProfiles() {
    if (!savedProfilesGrid || !profilesEmptyState) return;

    const profiles = getSavedProfiles();
    savedProfilesGrid.innerHTML = "";

    if (profiles.length === 0) {
      profilesEmptyState.classList.remove("hidden");
      savedProfilesGrid.classList.add("hidden");
      return;
    }

    profilesEmptyState.classList.add("hidden");
    savedProfilesGrid.classList.remove("hidden");

    profiles.forEach((p) => {
      const card = document.createElement("div");
      card.className = "saved-profile-card glass-card";
      card.innerHTML = `
        <div class="saved-profile-header">
          <div>
            <h3 class="saved-profile-name">${escapeHTML(p.name)}</h3>
            <span class="saved-profile-role">${escapeHTML(p.role)}</span>
          </div>
          <span class="saved-profile-date">${escapeHTML(p.date)}</span>
        </div>
        <p class="saved-profile-preview">${escapeHTML(p.outputData.headlinePrimary || p.outputData.about || "")}</p>
        <div class="saved-profile-footer">
          <button type="button" class="btn btn-secondary btn-mini btn-restore" data-id="${p.id}">
            Restore & View
          </button>
          <button type="button" class="btn btn-outline btn-mini btn-delete-saved" data-id="${p.id}" title="Delete snapshot">
            Delete
          </button>
        </div>
      `;
      savedProfilesGrid.appendChild(card);
    });

    // Event listeners for restore & delete
    savedProfilesGrid.querySelectorAll(".btn-restore").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        restoreProfileById(id);
      });
    });

    savedProfilesGrid.querySelectorAll(".btn-delete-saved").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        deleteProfileById(id);
      });
    });
  }

  function restoreProfileById(id) {
    const profiles = getSavedProfiles();
    const item = profiles.find((p) => p.id === id);
    if (!item) return;

    // Load form values
    inputFullName.value = item.formData.fullname || "";
    inputRole.value = item.formData.role || "";
    inputIndustry.value = item.formData.industry || "";
    inputEducation.value = item.formData.education || "";
    inputSkills.value = item.formData.skills || "";
    inputExperience.value = item.formData.experience || "";
    inputProjects.value = item.formData.projects || "";
    inputAchievements.value = item.formData.achievements || "";
    selectTone.value = item.formData.tone || "modern";

    // Render outputs
    renderOutputs(item.outputData, item.formData);
    switchView("generator");
    showToast(`Loaded profile for ${item.name}!`, "success");
  }

  function deleteProfileById(id) {
    let profiles = getSavedProfiles();
    profiles = profiles.filter((p) => p.id !== id);
    localStorage.setItem("proprofile_saved_profiles", JSON.stringify(profiles));
    updateSavedProfilesBadge();
    renderSavedProfiles();
    showToast("Profile removed from saved list", "success");
  }

  if (btnClearSavedProfiles) {
    btnClearSavedProfiles.addEventListener("click", () => {
      if (!confirm("Are you sure you want to clear all saved profiles?")) return;
      localStorage.removeItem("proprofile_saved_profiles");
      updateSavedProfilesBadge();
      renderSavedProfiles();
      showToast("All saved profiles cleared", "success");
    });
  }

  function updateDashboardStats() {
    updateSavedProfilesBadge();
  }

  function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Initial badge update
  updateSavedProfilesBadge();

  /* ============================================================================
     12. MAIN GENERATOR WORKFLOW (AI + FALLBACK)
     ============================================================================ */
  async function runGenerator() {
    if (!validateForm()) {
      showToast("Please fill in the required fields marked with *", "error");
      return;
    }

    const formData = {
      fullname: inputFullName.value.trim(),
      role: inputRole.value.trim(),
      industry: inputIndustry.value.trim(),
      education: inputEducation.value.trim(),
      skills: inputSkills.value.trim(),
      experience: inputExperience.value.trim(),
      projects: inputProjects.value.trim(),
      achievements: inputAchievements.value.trim(),
      tone: selectTone.value
    };

    const skillsArray = parseSkillsList(formData.skills);
    const selectedEngine = document.querySelector('input[name="engine"]:checked')?.value || "template";

    if (selectedEngine === "template") {
      runTemplateGenerator(formData, skillsArray, false);
      showToast("Profile generated with Smart Templates!", "success");
      return;
    }

    // AI Enhanced Mode
    setLoading(true);

    try {
      const result = await callAIGenerator(formData);

      if (result.success && result.data) {
        renderOutputs(result.data, formData);
        sourceBadge.textContent = `✨ AI Generated (${(result.provider || "Gemini").toUpperCase()})`;
        sourceBadge.className = "badge badge-source";
        sourceBadge.classList.remove("hidden");
        showToast("Profile generated with AI successfully!", "success");
      } else {
        console.warn("AI generation fallback triggered:", result.message || result.error);
        showToast(result.message || "AI unavailable. Switched to Smart Template fallback.", "warning");
        runTemplateGenerator(formData, skillsArray, true);
      }
    } catch (err) {
      console.warn("AI generation failed, using template fallback:", err.message);
      showToast("Backend or AI offline. Switched to Smart Template fallback.", "warning");
      runTemplateGenerator(formData, skillsArray, true);
    } finally {
      setLoading(false);
    }
  }

  /* ============================================================================
     13. CLIPBOARD COPY UTILITIES
     ============================================================================ */
  async function copyToClipboard(textToCopy, triggerButton) {
    if (!textToCopy) {
      showToast("Nothing to copy!", "error");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      if (triggerButton) {
        if (!triggerButton.dataset.originalHtml) {
          triggerButton.dataset.originalHtml = triggerButton.innerHTML;
        }

        if (triggerButton._copyTimer) {
          clearTimeout(triggerButton._copyTimer);
        }

        triggerButton.classList.add("copied");
        triggerButton.innerHTML = `
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        `;

        triggerButton._copyTimer = setTimeout(() => {
          triggerButton.innerHTML = triggerButton.dataset.originalHtml;
          triggerButton.classList.remove("copied");
          delete triggerButton.dataset.originalHtml;
          delete triggerButton._copyTimer;
        }, 2000);
      }

      showToast("Copied to clipboard!", "success");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      showToast("Unable to copy to clipboard", "error");
    }
  }

  /* ============================================================================
     14. EVENT LISTENERS
     ============================================================================ */
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    runGenerator();
  });

  btnRegenerate.addEventListener("click", () => {
    regenerateCount++;
    runGenerator();
  });

  btnLoadSample.addEventListener("click", () => {
    inputFullName.value = SAMPLE_DATA.fullname;
    inputRole.value = SAMPLE_DATA.role;
    inputIndustry.value = SAMPLE_DATA.industry;
    inputEducation.value = SAMPLE_DATA.education;
    inputSkills.value = SAMPLE_DATA.skills;
    inputExperience.value = SAMPLE_DATA.experience;
    inputProjects.value = SAMPLE_DATA.projects;
    inputAchievements.value = SAMPLE_DATA.achievements;
    selectTone.value = SAMPLE_DATA.tone;

    [groupFullName, groupRole, groupEducation, groupSkills].forEach((g) => {
      g.classList.remove("has-error");
    });

    switchView("generator");
    runGenerator();
    showToast("Sample data loaded!", "success");
  });

  btnClear.addEventListener("click", () => {
    const shouldClear = confirm("Are you sure you want to clear the entire form?");
    if (!shouldClear) return;

    profileForm.reset();

    // Preserve correct engine mode after reset
    if (backendState.aiConfigured) {
      radioEngineAI.checked = true;
    } else {
      radioEngineTemplate.checked = true;
    }

    [groupFullName, groupRole, groupEducation, groupSkills].forEach((g) => {
      g.classList.remove("has-error");
    });

    previewResults.classList.add("hidden");
    if (previewLoadingSkeleton) previewLoadingSkeleton.classList.add("hidden");
    previewEmptyState.classList.remove("hidden");
    sourceBadge.classList.add("hidden");

    // V3: Reset profile photo state
    if (currentProfilePhoto) {
      currentProfilePhoto = null;
      if (formPhotoImg) { formPhotoImg.src = ""; formPhotoImg.classList.add("hidden"); }
      if (photoAvatarPlaceholder) photoAvatarPlaceholder.classList.remove("hidden");
      if (btnUploadPhoto) btnUploadPhoto.classList.remove("hidden");
      if (btnChangePhoto) btnChangePhoto.classList.add("hidden");
      if (btnRemovePhoto) btnRemovePhoto.classList.add("hidden");
      if (previewAvatarImg) { previewAvatarImg.src = ""; previewAvatarImg.classList.add("hidden"); }
      if (previewAvatarInitials) previewAvatarInitials.style.display = "";
    }

    showToast("Form cleared.", "success");
  });

  // Section Copy Buttons
  document.addEventListener("click", (e) => {
    const copyBtn = e.target.closest(".btn-copy");
    if (!copyBtn) return;

    const targetId = copyBtn.getAttribute("data-target");
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        copyToClipboard(targetElement.textContent, copyBtn);
      }
    }
  });

  // Copy Full Profile Button
  btnCopyAll.addEventListener("click", () => {
    if (previewResults.classList.contains("hidden")) {
      showToast("Please generate a profile first!", "error");
      return;
    }

    const compiledProfile = [
      "========================================",
      "LINKEDIN HEADLINE",
      "========================================",
      outputHeadline ? outputHeadline.textContent : "",
      "",
      "Skill-Focused Variant: " + (outputHeadlineVar1 ? outputHeadlineVar1.textContent : ""),
      "Impact & Growth Variant: " + (outputHeadlineVar2 ? outputHeadlineVar2.textContent : ""),
      "",
      "========================================",
      "ABOUT SECTION",
      "========================================",
      outputAbout ? outputAbout.textContent : "",
      "",
      outputExperience && outputExperience.textContent ? "========================================\nEXPERIENCE\n========================================\n" + outputExperience.textContent + "\n" : "",
      outputEducation && outputEducation.textContent ? "========================================\nEDUCATION\n========================================\n" + outputEducation.textContent + "\n" : "",
      outputSkills && outputSkills.textContent ? "========================================\nSKILLS\n========================================\n" + outputSkills.textContent + "\n" : "",
      outputProjects && outputProjects.textContent ? "========================================\nPROJECTS\n========================================\n" + outputProjects.textContent + "\n" : ""
    ]
      .filter((block) => block.length > 0)
      .join("\n");

    copyToClipboard(compiledProfile, btnCopyAll);
  });

  /* ============================================================================
     15. V3: LIVE EDIT LISTENERS (contenteditable → update counters)
     ============================================================================ */
  if (outputHeadline) {
    outputHeadline.addEventListener("input", () => {
      updateCounters(outputHeadline.textContent, outputAbout ? outputAbout.textContent : "");
    });
  }
  if (outputAbout) {
    outputAbout.addEventListener("input", () => {
      updateCounters(outputHeadline ? outputHeadline.textContent : "", outputAbout.textContent);
    });
  }

  /* ============================================================================
     16. V3: PROFILE PHOTO UPLOAD HANDLERS
     ============================================================================ */

  // Click on preview box → open file picker
  if (formPhotoPreviewBox) {
    formPhotoPreviewBox.addEventListener("click", () => {
      if (inputProfilePhoto) inputProfilePhoto.click();
    });
  }

  // Upload button → open file picker
  if (btnUploadPhoto) {
    btnUploadPhoto.addEventListener("click", (e) => {
      e.stopPropagation();
      if (inputProfilePhoto) inputProfilePhoto.click();
    });
  }

  // File input change — read & display photo
  if (inputProfilePhoto) {
    inputProfilePhoto.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast("Please select a valid image file (JPG, PNG, WebP)", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image must be under 5MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        currentProfilePhoto = ev.target.result;

        // Form preview box
        if (formPhotoImg) { formPhotoImg.src = currentProfilePhoto; formPhotoImg.classList.remove("hidden"); }
        if (photoAvatarPlaceholder) photoAvatarPlaceholder.classList.add("hidden");
        if (btnUploadPhoto) btnUploadPhoto.classList.add("hidden");
        if (btnChangePhoto) btnChangePhoto.classList.remove("hidden");
        if (btnRemovePhoto) btnRemovePhoto.classList.remove("hidden");

        // LinkedIn card avatar
        if (previewAvatarImg) {
          previewAvatarImg.src = currentProfilePhoto;
          previewAvatarImg.classList.remove("hidden");
        }
        if (previewAvatarInitials) previewAvatarInitials.style.display = "none";

        showToast("Profile photo updated!", "success");
      };
      reader.readAsDataURL(file);
      inputProfilePhoto.value = ""; // allow re-selecting same file
    });
  }

  // Change photo button
  if (btnChangePhoto) {
    btnChangePhoto.addEventListener("click", (e) => {
      e.stopPropagation();
      if (inputProfilePhoto) inputProfilePhoto.click();
    });
  }

  // Remove photo button
  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener("click", (e) => {
      e.stopPropagation();
      currentProfilePhoto = null;
      if (formPhotoImg) { formPhotoImg.src = ""; formPhotoImg.classList.add("hidden"); }
      if (photoAvatarPlaceholder) photoAvatarPlaceholder.classList.remove("hidden");
      if (btnUploadPhoto) btnUploadPhoto.classList.remove("hidden");
      if (btnChangePhoto) btnChangePhoto.classList.add("hidden");
      if (btnRemovePhoto) btnRemovePhoto.classList.add("hidden");
      if (previewAvatarImg) { previewAvatarImg.src = ""; previewAvatarImg.classList.add("hidden"); }
      if (previewAvatarInitials) previewAvatarInitials.style.display = "";
      showToast("Profile photo removed", "success");
    });
  }

  /* ============================================================================
     17. V3: SAVE PROFILE BUTTON
     ============================================================================ */
  if (btnSaveProfile) {
    btnSaveProfile.addEventListener("click", () => {
      if (previewResults.classList.contains("hidden")) {
        showToast("Generate a profile first!", "error");
        return;
      }
      const formData = {
        fullname: inputFullName ? inputFullName.value.trim() : "",
        role: inputRole ? inputRole.value.trim() : "",
        industry: inputIndustry ? inputIndustry.value.trim() : "",
        education: inputEducation ? inputEducation.value.trim() : "",
        skills: inputSkills ? inputSkills.value.trim() : "",
        experience: inputExperience ? inputExperience.value.trim() : "",
        projects: inputProjects ? inputProjects.value.trim() : "",
        achievements: inputAchievements ? inputAchievements.value.trim() : "",
        tone: selectTone ? selectTone.value : "modern"
      };
      const outputData = {
        headlinePrimary: outputHeadline ? outputHeadline.textContent : "",
        headlineVariant1: outputHeadlineVar1 ? outputHeadlineVar1.textContent : "",
        headlineVariant2: outputHeadlineVar2 ? outputHeadlineVar2.textContent : "",
        about: outputAbout ? outputAbout.textContent : "",
        experience: outputExperience ? outputExperience.textContent : "",
        education: outputEducation ? outputEducation.textContent : "",
        skills: outputSkills ? outputSkills.textContent : "",
        projects: outputProjects ? outputProjects.textContent : ""
      };
      saveProfileSnapshot(formData, outputData);
      showToast("Profile saved to My Profiles!", "success");
    });
  }

  /* ============================================================================
     18. V3: DOWNLOAD DROPDOWN
     ============================================================================ */
  function getCompiledProfileText(format) {
    const name = previewName ? previewName.textContent.replace("✓", "").trim() : "";
    const role = previewRole ? previewRole.textContent.trim() : "";
    const hl = outputHeadline ? outputHeadline.textContent.trim() : "";
    const hl1 = outputHeadlineVar1 ? outputHeadlineVar1.textContent.trim() : "";
    const hl2 = outputHeadlineVar2 ? outputHeadlineVar2.textContent.trim() : "";
    const about = outputAbout ? outputAbout.textContent.trim() : "";
    const exp = outputExperience ? outputExperience.textContent.trim() : "";
    const edu = outputEducation ? outputEducation.textContent.trim() : "";
    const skills = outputSkills ? outputSkills.textContent.trim() : "";
    const proj = outputProjects ? outputProjects.textContent.trim() : "";

    if (format === "md") {
      return [
        `# LinkedIn Profile — ${name}`,
        `**${role}**`,
        "",
        "## Headline",
        hl,
        "",
        "### Headline Variants",
        `- ${hl1}`,
        `- ${hl2}`,
        "",
        "## About",
        about,
        exp ? `\n## Experience\n${exp}` : "",
        edu ? `\n## Education\n${edu}` : "",
        skills ? `\n## Skills\n${skills}` : "",
        proj ? `\n## Projects\n${proj}` : ""
      ].filter(Boolean).join("\n");
    }

    // Plain text
    return [
      `LINKEDIN PROFILE — ${name}`,
      role,
      "",
      "== HEADLINE ==",
      hl,
      "",
      `Skill-Focused: ${hl1}`,
      `Impact & Growth: ${hl2}`,
      "",
      "== ABOUT ==",
      about,
      exp ? `\n== EXPERIENCE ==\n${exp}\n` : "",
      edu ? `\n== EDUCATION ==\n${edu}\n` : "",
      skills ? `\n== SKILLS ==\n${skills}\n` : "",
      proj ? `\n== PROJECTS ==\n${proj}\n` : ""
    ].filter(Boolean).join("\n");
  }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function closeDownloadDropdown() {
    if (downloadDropdownWrap) downloadDropdownWrap.classList.remove("open");
    if (downloadDropdownMenu) downloadDropdownMenu.classList.add("hidden");
  }

  if (btnDownloadProfile) {
    btnDownloadProfile.addEventListener("click", (e) => {
      e.stopPropagation();
      if (downloadDropdownWrap) downloadDropdownWrap.classList.toggle("open");
      if (downloadDropdownMenu) downloadDropdownMenu.classList.toggle("hidden");
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (downloadDropdownWrap && !downloadDropdownWrap.contains(e.target)) {
      closeDownloadDropdown();
    }
  });

  if (btnDownloadMd) {
    btnDownloadMd.addEventListener("click", () => {
      if (previewResults.classList.contains("hidden")) {
        showToast("Generate a profile first!", "error");
        return;
      }
      const name = (inputFullName ? inputFullName.value.trim() : "profile").replace(/\s+/g, "-").toLowerCase() || "linkedin-profile";
      downloadFile(getCompiledProfileText("md"), `${name}.md`, "text/markdown");
      closeDownloadDropdown();
      showToast("Markdown profile downloaded!", "success");
    });
  }

  if (btnDownloadTxt) {
    btnDownloadTxt.addEventListener("click", () => {
      if (previewResults.classList.contains("hidden")) {
        showToast("Generate a profile first!", "error");
        return;
      }
      const name = (inputFullName ? inputFullName.value.trim() : "profile").replace(/\s+/g, "-").toLowerCase() || "linkedin-profile";
      downloadFile(getCompiledProfileText("txt"), `${name}.txt`, "text/plain");
      closeDownloadDropdown();
      showToast("Plain text profile downloaded!", "success");
    });
  }

  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener("click", () => {
      if (previewResults.classList.contains("hidden")) {
        showToast("Generate a profile first!", "error");
        return;
      }
      closeDownloadDropdown();
      window.print();
    });
  }

  /* ============================================================================
     19. V3: END
     ============================================================================ */

});
