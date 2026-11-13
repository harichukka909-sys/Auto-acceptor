# APK signing and release guide

## 1. Generate a release keystore

```bash
keytool -genkeypair -v -keystore nammaride-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias nammaride
```

Store the keystore and password in an owner-controlled private vault.

## 2. Build the app

Open the `android/` folder in Android Studio.

- set the SDK path
- sync Gradle
- choose `Build > Generate Signed Bundle / APK`
- use your own keystore
- build the release APK

## 3. Command line build (if Gradle is configured locally)

```bash
cd android
./gradlew assembleRelease
```

The output is generated in:

```bash
android/app/build/outputs/apk/release/
```

## 4. Upload release

The owner can upload APKs to:
- GitHub Releases
- Firebase App Distribution
- a private server
- an owned website
- any distribution platform the owner controls

Never rely on a developer-controlled keystore or release account.
