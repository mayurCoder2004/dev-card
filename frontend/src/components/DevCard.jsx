import React, { useRef, useState, useEffect } from "react";
import {
  Medal,
  Trophy,
  User,
  Flame,
  Globe,
  Star,
  BadgeCheck,
  Activity,
  Code2,
  Github,
  Download,
  Share2,
  Copy,
  Check,
  Loader2,
  BarChart2,
  RefreshCcw
} from "lucide-react";
import { SiLeetcode } from "react-icons/si";

const DevCard = ({
  githubData,
  leetcodeData,
  summary,
  languagesCount,
  pinnedRepos = [],
  onRefresh
}) => {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  
  // Generate MUCH shorter shareable URL
  useEffect(() => {
    if (githubData && leetcodeData) {
      const currentUrl = window.location.origin + window.location.pathname;
      // Simple query params instead of encoded JSON - much shorter!
      const newUrl = `${currentUrl}?gh=${githubData.login}&lc=${leetcodeData.username}`;
      setShareUrl(newUrl);
    }
  }, [githubData, leetcodeData]);

  const handleRefresh = async () => {
    if (!githubData?.login || !leetcodeData?.username) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh(githubData.login, leetcodeData.username);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyShareUrl = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  if (!githubData || !leetcodeData) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  // Improved summary splitting - handles multiple patterns
  let mainText = summary || "";
  let classificationText = null;

  if (summary) {
    // Look for classification patterns (case insensitive)
    const classificationPatterns = [
      /classification:\s*(.*?)$/i,
      /\*\*classification:\*\*\s*(.*?)$/i,
      /classification\s*-\s*(.*?)$/i,
      /\*\*classification\*\*:\s*(.*?)$/i
    ];

    for (const pattern of classificationPatterns) {
      const match = summary.match(pattern);
      if (match) {
        classificationText = match[1].replace(/\*\*/g, "").trim();
        mainText = summary.replace(match[0], "").replace(/\*\*/g, "").trim();
        break;
      }
    }

    // If no classification found with patterns, try simple split
    if (!classificationText && summary.toLowerCase().includes("classification:")) {
      const parts = summary.split(/classification:/i);
      if (parts.length === 2) {
        mainText = parts[0].replace(/\*\*/g, "").trim();
        classificationText = parts[1].replace(/\*\*/g, "").trim();
      }
    }

    // Clean up any remaining markdown
    mainText = mainText.replace(/\*\*/g, "").trim();
  }

  // LeetCode helper
  const stats = leetcodeData.submitStatsGlobal?.acSubmissionNum || [];
  const getCount = (diff) =>
    stats.find((s) => s.difficulty === diff)?.count || 0;

  return (
 <div className="relative overflow-hidden p-4 sm:p-8 max-w-[1200px] mx-auto">
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={copyShareUrl}
          disabled={!shareUrl}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Share Link'}
        </button>

        <button
  onClick={handleRefresh}
  disabled={isRefreshing}
  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isRefreshing ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : (
    <RefreshCcw className="w-4 h-4" />
  )}
  Refresh Data
</button>

      </div>

<div
  ref={cardRef}
  className="relative z-10 max-w-full mx-auto p-6 sm:p-10 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 dark:from-gray-900/40 dark:via-gray-900/30 dark:to-gray-900/20 border border-white/20 dark:border-gray-700/30 hover:bg-gradient-to-br hover:from-amber-100 hover:via-amber-50 hover:to-amber-100 dark:hover:from-gray-900/50 dark:hover:via-gray-900/40 dark:hover:to-gray-900/30 transition-all duration-500 hover:scale-[1.02]"
  style={{
    borderTop: "3px solid black",
    borderLeft: "3px solid black",
    borderRight: "3px solid black",
    borderBottom: "20px solid black",
  }}
>
        {/* GitHub Section */}
        <div className="flex items-center mb-6 border-l-4 border-yellow-600 pl-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-r-full" />
          <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 mr-3">
            <Github className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-yellow-600">GitHub Profile</h2>
        </div>

        <div className="flex flex-col items-center text-center mb-8 transform transition-all duration-300">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            <img
              src={githubData.avatar_url}
              alt="avatar"
              className="relative w-24 h-24 rounded-full border-4 border-white/80 dark:border-gray-800/80 transition-all duration-300"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 border-3 border-white dark:border-gray-800 rounded-full" />
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mt-6">
            {githubData.name || githubData.login}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
            @{githubData.login}
          </p>
          
          {/* GitHub Stats */}
          <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/30 px-3 py-1 rounded-full backdrop-blur-sm">
              <User className="w-4 h-4 mr-2 text-yellow-600" />
              <strong>{githubData.public_repos}</strong>&nbsp;Repos
            </div>
            <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/30 px-3 py-1 rounded-full backdrop-blur-sm">
              <strong>{githubData.public_gists}</strong>&nbsp;Gists
            </div>
            <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/30 px-3 py-1 rounded-full backdrop-blur-sm">
              <strong>{githubData.followers}</strong>&nbsp;Followers
            </div>
            <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/30 px-3 py-1 rounded-full backdrop-blur-sm">
              <strong>{githubData.following}</strong>&nbsp;Following
            </div>
          </div>

          <a
            href={githubData.html_url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-full hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
          >
            View GitHub Profile
          </a>
        </div>

        {/* Languages */}
        {languagesCount && Object.keys(languagesCount).length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
              <Code2 className="w-5 h-5 text-indigo-500" /> Languages Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(languagesCount).map(([lang, count]) => (
                <span
                  key={lang}
                  className="px-3 py-1 rounded-full bg-gray-100/50 dark:bg-gray-800/30 text-gray-900 dark:text-gray-100 text-xs font-semibold"
                  title={`${lang}: ${count} files`}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pinned Repos */}
        {pinnedRepos.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
              <Github className="w-5 h-5 text-black dark:text-white" />
              Pinned Repositories
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedRepos.map((repo) => (
                <li
                  key={repo.url || repo.repoName || repo.name}
                  className="group p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-white/30 dark:border-gray-700/30 transform transition-all duration-300 backdrop-blur-sm"
                >
                  <a
                    href={repo.url || repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black dark:text-yellow-300 hover:underline font-semibold text-sm"
                  >
                    {repo.repoName || repo.name || repo.repo}
                  </a>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                    {repo.description || "No description"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <hr
          className="my-8 h-px border-0"
          style={{
            backgroundColor: "#d97706",
          }}
        />

        {/* LeetCode Section */}
        <div className="flex items-center mb-6 border-l-4 border-yellow-400 pl-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-r-full" />
          <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 mr-3">
            <SiLeetcode className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-yellow-600">
            LeetCode Profile
          </h2>
        </div>

        <div className="flex flex-col items-center text-center transform transition-all duration-300 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            <img
              src={leetcodeData.profile?.userAvatar}
              alt="LeetCode Avatar"
              className="relative w-20 h-20 rounded-full border-3 border-white/80 dark:border-gray-800/80 transition-all duration-300"
            />
          </div>
          <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mt-3">
            {leetcodeData.profile?.realName || "Unknown"} ({leetcodeData.username})
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/30 px-3 py-1 rounded-full backdrop-blur-sm mt-2">
            {leetcodeData.profile?.countryName || "N/A"}
          </div>
          <a
            href={`https://leetcode.com/${leetcodeData.username}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-full hover:scale-105 hover:-translate-y-0.5 transition-all duration-300">
            Visit LeetCode Profile
          </a>
        </div>

        {/* LeetCode Stats */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent my-6">
            LeetCode Stats
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {[
              {
                label: "Total Solved",
                value: getCount("All"),
                icon: Trophy,
              },
              {
                label: "Easy",
                value: getCount("Easy"),
                icon: Medal,
              },
              {
                label: "Medium",
                value: getCount("Medium"),
                icon: Medal,
              },
              {
                label: "Hard",
                value: getCount("Hard"),
                icon: Medal,
              },
              {
                label: "Ranking",
                value: leetcodeData.profile?.ranking || "N/A",
                icon: BarChart2,
              },
              {
                label: "Streak",
                value: `${leetcodeData.userCalendar?.streak || 0} days`,
                icon: Flame,
              },
              {
                label: "Active Days",
                value: leetcodeData.userCalendar?.totalActiveDays || 0,
                icon: Activity,
              },
              {
                label: "Contest Rating",
                value: leetcodeData.userContestRanking?.rating || "N/A",
                icon: Star,
              },
              {
                label: "Acceptance Rate",
                value: leetcodeData.profile?.acceptanceRate
                  ? `${leetcodeData.profile.acceptanceRate}%`
                  : "N/A",
                icon: BadgeCheck,
              },
              {
                label: "Contests",
                value:
                  leetcodeData.userContestRanking?.totalParticipatedContests ||
                  0,
                icon: Globe,
              },
              {
                label: "Contribution Points",
                value: leetcodeData.profile?.contributionPoints || 0,
                icon: Activity,
              },
            ].map(({ icon: Icon, label, value }, idx) => (
              <div
                key={idx}
                className="group p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-white/30 dark:border-gray-700/30 transform transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 mr-3 transition-transform duration-300">
                      <Icon className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        {leetcodeData.badges?.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
              <BadgeCheck className="w-5 h-5 text-pink-500" /> Badges
            </h4>
            <div className="flex flex-wrap gap-3">
              {leetcodeData.badges.map((badge) => (
                <img
                  key={badge.id}
                  src={badge.icon}
                  alt={badge.displayName}
                  title={badge.displayName}
                  className="w-8 h-8"
                />
              ))}
            </div>
          </div>
        )}

        {/* Language-wise Problems */}
        {leetcodeData.languageProblemCount?.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
              <Code2 className="w-5 h-5 text-cyan-500" />
              Problems by Language
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
              {leetcodeData.languageProblemCount.map((lang, idx) => (
                <li
                  key={idx}
                  className="flex justify-between">
                  {lang.languageName}:{" "}
                  <span className="font-medium">{lang.problemsSolved}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Summary */}
        {mainText && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/40 dark:to-gray-900/40 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              🧠 AI Summary
            </h3>
            <div className="text-center">
              <p className="leading-relaxed text-gray-800 dark:text-gray-300 font-medium mb-4">
                {mainText}
              </p>
              
              {/* Enhanced Classification Display */}
              {classificationText && (
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative px-6 py-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 text-black font-bold rounded-full border-2 border-white/50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        <span className="text-lg">
                          Classification: {classificationText}
                        </span>
                        <Star className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevCard;