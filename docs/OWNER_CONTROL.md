# APK signing and release guide

## 1. Generate a keystore

```bash
keytool -genkeypair -v -keystore nammaride-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias nammaride
```

Store it in a private, owner-controlled location.

## 2. Build release APK

Open the `android/` folder in Android Studio and choose `Generate Signed Bundle / APK`.

Or from terminal:

```bash
cd android
./gradlew assembleRelease
```

## 3. Upload the APK

The owner may upload the APK to any distribution platform they control, including GitHub Releases, a company website, or a private channel.

## 4. Ownership rule

The project owner must keep the keystore and signing password in their own secure storage. No developer-controlled key should be required to release updates.
