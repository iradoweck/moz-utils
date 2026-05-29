# Installation

Installing `moz-utils` is quick and straightforward, no matter what ecosystem you are working in. Choose your preferred language below to see the installation command.

## TypeScript / Node.js
If you are using Node.js, Next.js, React, or any JS environment:

```bash
npm install moz-utils
# or
yarn add moz-utils
# or
pnpm add moz-utils
```

## Python
Available directly from PyPI. Ideal for Django, Flask, FastAPI or Data Science scripts.

```bash
pip install moz-utils
```

## PHP
Available on Packagist for your Laravel, Symfony, or native PHP applications.

```bash
composer require iradoweck/moz-utils
```

## Dart & Flutter
Available on pub.dev. Perfect for cross-platform mobile apps.

```bash
flutter pub add moz_utils
# or for pure Dart projects
dart pub add moz_utils
```

## Kotlin & Java
Distributed via JitPack for your Android apps or Spring Boot backends.

Add the JitPack repository to your `settings.gradle.kts` or `build.gradle`:

```kotlin
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven(url = "https://jitpack.io")
    }
}
```

Then add the dependency in your `build.gradle.kts`:

```kotlin
dependencies {
    implementation("com.github.iradoweck:moz-utils:0.3.3")
}
```
