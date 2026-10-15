/* ==========================================================
   All projects shown in the "All projects" grid.
   To add a project: copy one object, change the fields, save.
     name  : card title
     desc  : one or two sentences
     tech  : small tags shown on the card
     cats  : filters it appears under (see PROJECT_FILTERS)
     repo  : GitHub repository name (https://github.com/Mina8496/<repo>)
   Order matters: the first 9 are visible before "Show all".
   ========================================================== */

window.PROJECT_FILTERS = [
  ['all', 'All'],
  ['payments', 'Payments'],
  ['bloc', 'Bloc / Cubit'],
  ['firebase', 'Firebase'],
  ['api', 'REST APIs'],
  ['ai', 'AI'],
  ['backend', 'Backend'],
  ['learning', 'Learning']
];

window.PROJECTS = [
  {
    name: 'Checkout Payment (Stripe)',
    desc: 'A secure checkout flow with Stripe, built with Clean Architecture and Bloc/Cubit, with API integration plus error and loading states.',
    tech: ['Flutter', 'Stripe', 'Bloc/Cubit', 'Clean Architecture'],
    cats: ['payments', 'bloc', 'api'],
    repo: 'checkout_payment'
  },
  {
    name: 'Checkout Payment (Paymob)',
    desc: 'Payment integration with the Paymob gateway using Clean Architecture and Bloc/Cubit state management.',
    tech: ['Flutter', 'Paymob', 'Bloc/Cubit', 'Clean Architecture'],
    cats: ['payments', 'bloc', 'api'],
    repo: 'checkout_payment_by_paymab'
  },
  {
    name: 'Tasks App (Clean Architecture)',
    desc: 'Task manager built with Clean Architecture and BLoC, with SQLite storage, REST APIs, search, WebView and Postman-tested endpoints.',
    tech: ['Flutter', 'Bloc', 'SQLite', 'REST APIs', 'SharedPreferences'],
    cats: ['bloc', 'api'],
    repo: 'tasks_app_clean_architecture'
  },
  {
    name: 'News App',
    desc: 'News reader with REST API integration through Dio, search, WebView, a custom theme with dark mode, and API testing in Postman.',
    tech: ['Flutter', 'Dio', 'REST APIs', 'Dark mode', 'Postman'],
    cats: ['api'],
    repo: 'NewsApp'
  },
  {
    name: 'Scholar Chat',
    desc: 'Real-time messaging with Firebase email/password authentication, live Firestore updates, form validation and separate bubble styles for senders.',
    tech: ['Flutter', 'Firebase Auth', 'Cloud Firestore'],
    cats: ['firebase'],
    repo: 'scholar_chat'
  },
  {
    name: 'Story App',
    desc: 'Product catalog on the Fake Store API: responsive grid, add and update forms, typed Dart models and model parsing tests.',
    tech: ['Flutter', 'REST APIs', 'HTTP', 'JSON'],
    cats: ['api'],
    repo: 'story_app'
  },
  {
    name: 'MyFarm Backend API',
    desc: 'RESTful APIs built with Node.js and Express.',
    tech: ['Node.js', 'Express', 'REST APIs'],
    cats: ['backend', 'api'],
    repo: 'myfarm-backend-api'
  },
  {
    name: 'Personality Analysis System',
    desc: 'Graduation project that analyzes personality traits with AI techniques, with a Flutter front end and REST API communication.',
    tech: ['Flutter', 'Machine learning', 'REST APIs'],
    cats: ['ai', 'api'],
    repo: 'personality_analysis_system'
  },
  {
    name: 'InvoicePro',
    desc: 'Cashier and invoice management for small businesses: create invoices, track daily sales and manage transactions.',
    tech: ['Flutter', 'Dart', 'SQL Server'],
    cats: [],
    repo: 'invoice-pro-system'
  },
  {
    name: 'To-Do App',
    desc: 'To-do app with Clean Architecture and BLoC: create, update and delete tasks, SQLite persistence and API integration.',
    tech: ['Flutter', 'Bloc', 'sqflite', 'Dio'],
    cats: ['bloc', 'api'],
    repo: 'to_do_app'
  },
  {
    name: 'Mobile Ads (AdMob)',
    desc: 'Google Mobile Ads integration with banner, interstitial, rewarded and app-open ads through a reusable ad service.',
    tech: ['Flutter', 'AdMob', 'Clean structure'],
    cats: [],
    repo: 'Mobile-Ads'
  },
  {
    name: 'Shop App',
    desc: 'E-commerce app for browsing products and viewing product details.',
    tech: ['Flutter', 'Dart'],
    cats: [],
    repo: 'shop_app'
  },
  {
    name: 'Local Storage with Hive',
    desc: 'Local data persistence with Hive: full create, read, update and delete operations, built while learning state management with stored data.',
    tech: ['Flutter', 'Hive'],
    cats: ['learning'],
    repo: 'local_date_hive_flutter'
  },
  {
    name: 'Flutter Animations',
    desc: 'Implicit and explicit animations, custom animations with AnimationController and smooth transitions between UI states.',
    tech: ['Flutter', 'Animations'],
    cats: ['learning'],
    repo: 'animation'
  },
  {
    name: 'Weather App',
    desc: 'Weather app that consumes a weather API, built while learning to work with REST APIs.',
    tech: ['Flutter', 'REST APIs'],
    cats: ['api', 'learning'],
    repo: 'Weather-App-Api'
  },
  {
    name: 'Basketball Points Counter',
    desc: 'Points counter for a basketball game, an early Flutter practice project.',
    tech: ['Flutter', 'Dart'],
    cats: ['learning'],
    repo: 'Basketball-Points-Counter-App'
  },
  {
    name: 'Traveling App',
    desc: 'Travel-themed app from my early Flutter learning projects.',
    tech: ['Flutter', 'Dart'],
    cats: ['learning'],
    repo: 'Traveling_app'
  },
  {
    name: 'Language Learning App',
    desc: 'Language learning app built as an early Flutter practice project.',
    tech: ['Flutter', 'Dart'],
    cats: ['learning'],
    repo: 'language_learning_app'
  },
  {
    name: 'ODC Workshop',
    desc: 'Exercises and practice from a Flutter workshop.',
    tech: ['Flutter', 'Dart'],
    cats: ['learning'],
    repo: 'odc_workshop'
  },
  {
    name: 'Chat App (early version)',
    desc: 'Early chat app project from my first steps in Flutter.',
    tech: ['Flutter', 'Dart'],
    cats: ['learning'],
    repo: 'my_flutter_project'
  }
];
