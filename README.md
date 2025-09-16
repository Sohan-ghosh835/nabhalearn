# NabhaLearn 📚

**AI-Powered Offline-First Education App**

NabhaLearn is a revolutionary React Native application that brings AI-powered education to offline environments, making quality learning accessible even without internet connectivity.

## 🌟 Features

### 🎯 Core Features
- **📱 Offline-First Architecture** - Download content once, learn anywhere
- **🎚️ Smart Video Compression** - Multiple resolution options (144p to 1080p)
- **🤖 AI-Powered Upscaling** - Real-time video enhancement using on-device AI
- **📚 Interactive Lessons** - Engaging educational content with progress tracking
- **💾 Storage Management** - Intelligent storage optimization and tracking
- **🎮 Gamified Learning** - Mini-games and interactive elements for engagement

### 🎨 User Interface
- **Modern Design** - Clean, intuitive mobile-first interface
- **Responsive Layout** - Optimized for various screen sizes
- **Dark/Light Theme** - User preference support
- **Accessibility** - Screen reader and accessibility features

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **React Native CLI** (`npm install -g @react-native-community/cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)
- **Java Development Kit (JDK)** (v17 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NabhaLearn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Android Setup**
   - Open Android Studio
   - Install Android SDK (API level 23 or higher)
   - Set up Android emulator or connect physical device

### Running the App

#### Android
```bash
# Start Metro bundler
npx react-native start

# Run on Android (in a new terminal)
npx react-native run-android
```

#### iOS (macOS only)
```bash
# Start Metro bundler
npx react-native start

# Run on iOS (in a new terminal)
npx react-native run-ios
```

## 📱 App Structure

```
NabhaLearn/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ResolutionSlider.tsx
│   │   └── VideoDownloadCard.tsx
│   ├── screens/            # Main app screens
│   │   └── VideoDownloadScreen.tsx
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   └── navigation/         # Navigation configuration
├── android/                # Android-specific code
├── ios/                    # iOS-specific code
├── App.tsx                 # Main app component
├── index.js                # App entry point
└── package.json            # Dependencies and scripts
```

## 🎯 Key Components

### ResolutionSlider
Interactive component for selecting video download quality with file size information.

### VideoDownloadCard
Displays lesson information with download progress and management options.

### VideoDownloadScreen
Main screen orchestrating the download experience with storage tracking.

## 🛠️ Technology Stack

- **Frontend**: React Native 0.74.5
- **Language**: TypeScript
- **State Management**: React Hooks
- **Navigation**: React Navigation (planned)
- **Storage**: AsyncStorage (planned)
- **AI Integration**: ONNX Runtime (planned)
- **Video Processing**: React Native Video (planned)

## 🔮 Planned Features

### Phase 1 - Core Functionality
- [ ] Video player with AI upscaling
- [ ] Offline content management
- [ ] Progress tracking and analytics
- [ ] User authentication

### Phase 2 - Advanced Features
- [ ] Teacher dashboard
- [ ] Assignment system
- [ ] Device-to-device sharing
- [ ] Advanced AI tutor integration

### Phase 3 - Platform Expansion
- [ ] Web version
- [ ] Desktop applications
- [ ] Multi-language support
- [ ] Advanced analytics

## 🎨 Design Philosophy

NabhaLearn follows these design principles:

- **Offline-First**: Core functionality works without internet
- **AI-Enhanced**: Intelligent features improve learning experience
- **Accessible**: Designed for users with varying technical abilities
- **Scalable**: Architecture supports growth and feature expansion
- **Performance**: Optimized for low-end devices and limited storage

## 📊 Performance Considerations

- **Video Compression**: Multiple resolution options for storage optimization
- **Lazy Loading**: Content loaded on-demand
- **Caching**: Intelligent caching strategies
- **Memory Management**: Efficient resource utilization
- **Battery Optimization**: Minimal background processing

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native community for the excellent framework
- Educational technology pioneers
- Open source contributors
- Beta testers and feedback providers

## 📞 Support

For support, email support@nabhalearn.com or join our community Discord.

## 🔗 Links

- [Documentation](https://docs.nabhalearn.com)
- [Community Forum](https://community.nabhalearn.com)
- [Bug Reports](https://github.com/nabhalearn/nabhalearn/issues)
- [Feature Requests](https://github.com/nabhalearn/nabhalearn/discussions)

---

**Made with ❤️ for accessible education worldwide**