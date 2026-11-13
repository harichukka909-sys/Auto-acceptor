# APK signing and release guide

## 1. Create a keystore

```bash
keytool -genkeypair -v -keystore nammaride-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias nammaride
```

Store the keystore safely. The project owner owns it.

## 2. Configure signing in Android Studio

- Open the Android project in Android Studio.
- Open `Build > Generate Signed Bundle / APK`.
- Choose `APK` or `AAB`.
- Use your own keystore.
- Enter the alias and password.
- Save the keystore in a private, owner-controlled location.

## 3. Build from command line

```bash
cd android
./gradlew assembleRelease
```

The signed APK is generated under:

```bash
android/app/build/outputs/apk/release/
```

## 4. Upload to distribution platform

The owner may upload APKs to any distribution platform they control, such as:
- GitHub Releases
- Firebase App Distribution
- an owned website
- a private enterprise distribution channel

Never depend on a developer-controlled signing key.
