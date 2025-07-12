const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const allowedOrigins = [
  "https://dev-card-frontend.vercel.app",
  "http://localhost:3000" // for local testing
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed from this origin"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Replace with your actual API key
 const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 


app.get("/", (req, res) => {
  res.send("hello");
});




// app.get("/api/github/:username", async (req, res) => {
//       try {
//             const { username } = req.params;
//             const response = await axios.get(`https://api.github.com/users/${username}`);
//             const userData = response.data;
//             res.json(userData);
//       } catch (error) {
//             res.json({ error: "GitHub user not found" });
//       }
// });

async function scrapeLanguagesFromRepos(username) {
  try {
    const url = `https://github.com/${username}?tab=repositories`;
    console.log(`Scraping languages from: ${url}`);

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);
    const languages = {};

    // Multiple selectors to try
    const selectors = [
      "li[itemprop='owns'] span[itemprop='programmingLanguage']",
      "[data-testid='repository-card'] span[itemprop='programmingLanguage']",
      ".repository-lang-stats-graph span",
      "[aria-label*='language'] span",
      ".repo-language-color + span",
    ];

    let found = false;
    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        const lang = $(elem).text().trim();
        if (lang && lang !== "") {
          languages[lang] = (languages[lang] || 0) + 1;
          found = true;
        }
      });
      if (found) break;
    }

    // Alternative approach: look for language indicators in repo cards
    if (!found) {
      $("article.Box-row, .Box-row").each((i, elem) => {
        const langElement = $(elem)
          .find('span[itemprop="programmingLanguage"], .f6 span')
          .last();
        const lang = langElement.text().trim();
        if (
          lang &&
          lang !== "" &&
          !lang.includes("Updated") &&
          !lang.includes("ago")
        ) {
          languages[lang] = (languages[lang] || 0) + 1;
        }
      });
    }

    console.log(`Found languages:`, languages);
    return languages;
  } catch (error) {
    console.error("Error scraping repo languages:", error.message);
    return {};
  }
}

// Enhanced pinned repos scraping
async function scrapePinnedRepos(username) {
  try {
    const url = `https://github.com/${username}`;
    console.log(`Scraping pinned repos from: ${url}`);

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);
    const pinnedRepos = [];

    // Multiple selectors for pinned repositories
    const pinnedSelectors = [
      ".pinned-item-list-item",
      "[data-testid='pinned-repository']",
      ".js-pinned-items-reorder-list .pinned-item-list-item-content",
    ];

    let found = false;
    for (const selector of pinnedSelectors) {
      $(selector).each((i, elem) => {
        const repoNameElement = $(elem).find("span.repo, .f4 a, h3 a").first();
        const repoName = repoNameElement.text().trim();

        const description = $(elem)
          .find("p.pinned-item-desc, .f6.color-fg-muted, .pinned-item-desc")
          .text()
          .trim();
        const language = $(elem)
          .find("[itemprop='programmingLanguage'], .f6 span")
          .last()
          .text()
          .trim();

        if (repoName) {
          pinnedRepos.push({
            repoName: repoName.replace(username + "/", ""),
            description: description || "No description available",
            language: language || "Not specified",
          });
          found = true;
        }
      });
      if (found) break;
    }

    console.log(`Found pinned repos:`, pinnedRepos);
    return pinnedRepos;
  } catch (error) {
    console.error("Error scraping pinned repos:", error.message);
    return [];
  }
}

// Enhanced contributions scraping
async function scrapeGitHubProfile(username) {
  try {
    const url = `https://github.com/${username}`;
    console.log(`Scraping profile from: ${url}`);

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);

    // Multiple selectors for contributions
    const contributionSelectors = [
      "h2.f4.text-normal.mb-2",
      ".js-yearly-contributions h2",
      "[data-testid='contributions-graph'] h2",
      ".ContributionCalendar h2",
    ];

    let contributionsText = "";
    for (const selector of contributionSelectors) {
      const text = $(selector).first().text().trim();
      if (text && text.includes("contribution")) {
        contributionsText = text;
        break;
      }
    }

    // Try to get contribution count from the graph
    if (!contributionsText) {
      const contributionCount = $(".js-yearly-contributions .f4.text-normal")
        .text()
        .trim();
      if (contributionCount) {
        contributionsText = contributionCount;
      }
    }

    console.log(`Found contributions text:`, contributionsText);
    return { contributionsThisYear: contributionsText };
  } catch (error) {
    console.error("Error scraping GitHub profile:", error.message);
    return { contributionsThisYear: "Unable to fetch contributions data" };
  }
}

// Add delay function to avoid rate limiting
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/api/github/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log(`Processing GitHub profile for: ${username}`);

    // GitHub user data from official API
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
      }
    );
    const userData = response.data;

    // Add delays between scraping requests
    await delay(1000);
    const profileData = await scrapeGitHubProfile(username);

    await delay(1000);
    const pinnedRepos = await scrapePinnedRepos(username);

    await delay(1000);
    const languagesFromRepos = await scrapeLanguagesFromRepos(username);

    // Language summary with percentages
    const total = Object.values(languagesFromRepos).reduce(
      (acc, val) => acc + val,
      0
    );
    const languageSummary =
      total > 0
        ? Object.entries(languagesFromRepos).map(([language, count]) => ({
            language,
            percent: ((count / total) * 100).toFixed(1) + "%",
          }))
        : [];

    const result = {
      userData,
      pinnedRepos,
      languageSummary,
      joinDate: userData.created_at,
      contributionsThisYear: profileData.contributionsThisYear,
      languagesCount: languagesFromRepos,
      scrapingStatus: {
        profileScraped: !!profileData.contributionsThisYear,
        pinnedReposFound: pinnedRepos.length > 0,
        languagesFound: Object.keys(languagesFromRepos).length > 0,
      },
    };

    console.log("Final result:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in /api/github/:username:", error.message);
    res.status(404).json({ error: "GitHub user not found or error occurred" });
  }
});

app.get("/api/leetcode/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql/",
      {
        operationName: "getUserProfile",
        variables: { username },
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                realName
                userAvatar
                ranking
                countryName
                starRating
                skillTags
                birthday
                jobTitle
              }
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
              badges {
                id
                displayName
                icon
                creationDate
              }
              userCalendar {
                streak
                totalActiveDays
                submissionCalendar
              }
              languageProblemCount {
                languageName
                problemsSolved
              }
            }
          }
        `,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
 console.log("LeetCode raw response:", JSON.stringify(response.data, null, 2));

    const user = response.data.data.matchedUser;
    if (!user)
      return res.status(404).json({ error: "LeetCode username not found" });

    // Return user data without contestRanking and contestHistory
    res.json(user);
  } catch (error) {
    console.error("LeetCode API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch LeetCode data." });
  }
});
    

// 🔥 GEMINI summary endpoint
app.get("/api/gemini/summary", async (req, res) => {
  const { githubUsername, leetcodeUsername } = req.query;

  if (!githubUsername || !leetcodeUsername) {
    return res.status(400).json({ error: "Both usernames are required" });
  }

  try {
    const githubRes = await axios.get(
      `https://api.github.com/users/${githubUsername}`
    );
    const github = githubRes.data;

    const leetcodeRes = await axios.post("https://leetcode.com/graphql/", {
      operationName: "getUserProfile",
      variables: { username: leetcodeUsername },
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile { ranking }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
    });

    const lc = leetcodeRes.data.data.matchedUser;
    const leetcodeStats = lc.submitStatsGlobal.acSubmissionNum.reduce(
      (acc, item) => {
        acc[item.difficulty.toLowerCase()] = item.count;
        return acc;
      },
      {}
    );

    const prompt = `
Using a person's GitHub and LeetCode profiles, write one clear and professional paragraph that highlights their programming strengths. Mention the number of public repositories on GitHub along with any standout technologies, frameworks, or types of projects they have worked on. From their LeetCode profile, include the total number of problems solved, grouped by difficulty (Easy, Medium, Hard). Use simple and resume-friendly language without technical jargon or special formatting. Conclude the paragraph by identifying whether the individual is best described as a "Developer", "Problem Solver", or "Both", depending on whether their strengths are in building practical projects, solving algorithmic problems, or a strong combination of the two.

GitHub:
- Name: ${github.name || github.login}
- Bio: ${github.bio || "No bio provided"}
- Public Repositories: ${github.public_repos}
- Followers: ${github.followers}
- Following: ${github.following}

LeetCode:
- Username: ${lc.username}
- Ranking: ${lc.profile.ranking}
- Problems Solved - Easy: ${leetcodeStats.easy || 0}
- Medium: ${leetcodeStats.medium || 0}
- Hard: ${leetcodeStats.hard || 0}
`;

     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ summary: responseText });
  } catch (error) {
    console.error("Error generating summary:", error.message);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
