# DevCard 🚀

Beautiful developer profile cards combining GitHub and LeetCode data with AI-powered insights.

## ✨ Features

- **GitHub Integration** - Repos, followers, languages, pinned projects
- **LeetCode Stats** - Problems solved, contest ratings, badges
- **AI Summary** - Intelligent developer classification
- **Beautiful Design** - Modern glassmorphism with animations
- **Share & Refresh** - Generate shareable links and update data

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dev-card.git
cd dev-card

# Install dependencies
npm install
# or
yarn install

# Start development server
npm start
# or
yarn start
```

### Project Structure
```
dev-card/
├── src/
│   ├── components/
│   │   └── DevCard.jsx
│   ├── utils/
│   └── App.js
├── public/
└── package.json
```


## 📝 Usage

```jsx
import DevCard from './components/DevCard';

<DevCard
  githubData={githubData}
  leetcodeData={leetcodeData}
  summary={aiSummary}
  languagesCount={languagesCount}
  pinnedRepos={pinnedRepos}
  onRefresh={handleRefresh}
/>
```

## 🎨 Props

| Prop | Type | Description |
|------|------|-------------|
| `githubData` | `object` | GitHub profile data |
| `leetcodeData` | `object` | LeetCode statistics |
| `summary` | `string` | AI-generated summary |
| `languagesCount` | `object` | Programming languages used |
| `pinnedRepos` | `array` | Pinned repositories |
| `onRefresh` | `function` | Refresh callback |

## 📊 Data Structure

```typescript
// GitHub Data
{
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  // ...
}

// LeetCode Data
{
  username: string;
  profile: { realName, ranking, acceptanceRate };
  submitStatsGlobal: { acSubmissionNum };
  userCalendar: { streak, totalActiveDays };
  // ...
}
```

## 🎨 Customization

The component uses Tailwind CSS. Key styling:

```jsx
// Main card with custom border
className="rounded-3xl backdrop-blur-xl bg-gradient-to-br from-amber-50 to-amber-100"
style={{
  borderTop: "3px solid black",
  borderBottom: "20px solid black"
}}
```

## 🔧 Dependencies

- React 18+
- Tailwind CSS
- Lucide React (icons)
- React Icons

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for developers**
