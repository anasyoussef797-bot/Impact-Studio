import { AndroidFile } from '../types';

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: 'build.gradle.kts',
    filename: 'build.gradle.kts (Project)',
    category: 'gradle',
    code: `// File: build.gradle.kts (Project Level)
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`
  },
  {
    path: 'settings.gradle.kts',
    filename: 'settings.gradle.kts',
    category: 'gradle',
    code: `// File: settings.gradle.kts
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Impact Studio"
include(":app")
`
  },
  {
    path: 'gradle.properties',
    filename: 'gradle.properties',
    category: 'gradle',
    code: `# File: gradle.properties
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRclass=true
`
  },
  {
    path: 'app/build.gradle.kts',
    filename: 'app/build.gradle.kts',
    category: 'gradle',
    code: `// File: app/build.gradle.kts
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.impacthubegypt.impactstudio"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.impacthubegypt.impactstudio"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")

    // Compose Material 3 & Navigation
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.7.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")

    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation(platform("androidx.compose:compose-bom:2024.02.00"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    filename: 'AndroidManifest.xml',
    category: 'manifest',
    code: `<?xml version="1.0" encoding="utf-8"?>
<!-- File: app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.impacthubegypt.impactstudio">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ImpactStudio"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.ImpactStudio"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    filename: 'strings.xml',
    category: 'res',
    code: `<?xml version="1.0" encoding="utf-8"?>
<!-- File: app/src/main/res/values/strings.xml -->
<resources>
    <string name="app_name">Impact Studio</string>
    <string name="developer_name">Impact Hub Egypt</string>
    <string name="tagline">Children\'s Voice Text-To-Speech Studio</string>

    <string name="nav_home">Home</string>
    <string name="nav_characters">Children</string>
    <string name="nav_settings">Settings</string>

    <string name="enter_text_hint">Enter or paste text here to hear children speak…</string>
    <string name="play_speech">Play Speech</string>
    <string name="stop_speech">Stop</string>
    <string name="group_speech_title">Group Speech (النطق الجماعي)</string>
    <string name="group_speech_desc">Select multiple children to speak together as a chorus</string>
    
    <!-- Dialects -->
    <string name="dialect_gulf">Gulf Arabic (اللهجة الخليجية)</string>
    <string name="dialect_fusha">Modern Standard Arabic (العربية الفصحى)</string>
    <string name="dialect_egyptian">Egyptian Arabic (العامية المصرية)</string>
    <string name="dialect_english">English</string>
    <string name="dialect_french">French</string>
    <string name="dialect_german">German</string>

    <!-- Character Names -->
    <string name="char_lulu">Lulu (لولو)</string>
    <string name="char_rashed">Rashed (راشد)</string>
    <string name="char_noor">Noor (نور)</string>
    <string name="char_ali">Ali (علي)</string>
    <string name="char_sara">Sara (سارة)</string>

    <!-- Controls -->
    <string name="pitch_label">Voice Pitch (تنعيم/حدّة الصوت)</string>
    <string name="rate_label">Speech Speed (سرعة القراءة)</string>
    <string name="reset_defaults">Reset Defaults</string>
    <string name="save_changes">Save Changes</string>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    filename: 'colors.xml',
    category: 'res',
    code: `<?xml version="1.0" encoding="utf-8"?>
<!-- File: app/src/main/res/values/colors.xml -->
<resources>
    <color name="purple_200">#FFBB86FC</color>
    <color name="purple_500">#FF6200EE</color>
    <color name="purple_700">#FF3700B3</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="teal_700">#FF018786</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>

    <!-- Playful Pastel Theme Colors -->
    <color name="primary_pastel_coral">#FF6C5CE7</color>
    <color name="secondary_pastel_teal">#FF00CEC9</color>
    <color name="tertiary_pastel_pink">#FFFD79A8</color>
    <color name="background_light">#FAFAFE</color>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    filename: 'themes.xml',
    category: 'res',
    code: `<?xml version="1.0" encoding="utf-8"?>
<!-- File: app/src/main/res/values/themes.xml -->
<resources>
    <style name="Theme.ImpactStudio" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">#6C5CE7</item>
        <item name="android:windowLightStatusBar">false</item>
    </style>
</resources>
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/data/model/LanguageDialect.kt',
    filename: 'LanguageDialect.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.data.model

import java.util.Locale

/**
 * Supported Languages and Arabic Dialects for Impact Studio
 */
enum class LanguageDialect(
    val id: String,
    val displayName: String,
    val nativeName: String,
    val primaryLocale: Locale,
    val voiceKeywords: List<String>,
    val flagEmoji: String,
    val defaultSampleText: String
) {
    GULF_ARABIC(
        id = "gulf_ar",
        displayName = "Gulf Arabic",
        nativeName = "اللهجة الخليجية",
        primaryLocale = Locale("ar", "AE"),
        voiceKeywords = listOf("ar-ae", "ar-sa", "ar-kw", "gulf", "ae", "sa"),
        flagEmoji = "🇦🇪",
        defaultSampleText = "هلا والله! شحالكم يا أطفال؟ أهلاً بكم في إمباكت ستوديو"
    ),
    FUSHA_ARABIC(
        id = "fusha_ar",
        displayName = "Modern Standard Arabic",
        nativeName = "العربية الفصحى",
        primaryLocale = Locale("ar", "XA"),
        voiceKeywords = listOf("ar-xa", "ar-001", "fusha", "ar"),
        flagEmoji = "🇸🇦",
        defaultSampleText = "مرحباً بكم أصدقائي في تطبيق تحويل النص إلى صوت الأطفال"
    ),
    EGYPTIAN_ARABIC(
        id = "egyptian_ar",
        displayName = "Egyptian Arabic",
        nativeName = "العامية المصرية",
        primaryLocale = Locale("ar", "EG"),
        voiceKeywords = listOf("ar-eg", "egypt", "eg"),
        flagEmoji = "🇪🇬",
        defaultSampleText = "أهلاً بيكم يا أصحابنا، يلا بينا نتكلم كلنا مع بعض!"
    ),
    ENGLISH(
        id = "english",
        displayName = "English",
        nativeName = "English",
        primaryLocale = Locale.US,
        voiceKeywords = listOf("en-us", "en-gb", "en"),
        flagEmoji = "🇺🇸",
        defaultSampleText = "Hello everyone! Welcome to Impact Studio children voice narrator."
    ),
    FRENCH(
        id = "french",
        displayName = "French",
        nativeName = "Français",
        primaryLocale = Locale.FRANCE,
        voiceKeywords = listOf("fr-fr", "fr"),
        flagEmoji = "🇫🇷",
        defaultSampleText = "Bonjour les enfants! Bienvenue dans le studio de voix d'Impact Studio."
    ),
    GERMAN(
        id = "german",
        displayName = "German",
        nativeName = "Deutsch",
        primaryLocale = Locale.GERMANY,
        voiceKeywords = listOf("de-de", "de"),
        flagEmoji = "🇩🇪",
        defaultSampleText = "Hallo Kinder! Willkommen im Impact Studio Kinderstimmen-Studio."
    );

    companion object {
        fun fromId(id: String): LanguageDialect {
            return entries.find { it.id == id } ?: GULF_ARABIC
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/data/model/ChildCharacter.kt',
    filename: 'ChildCharacter.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.data.model

/**
 * Child character data model representing a virtual child voice.
 */
data class ChildCharacter(
    val id: String,
    val name: String,
    val arabicName: String,
    val avatarEmoji: String,
    val pitch: Float = 1.5f,        // Higher pitch simulates a child's vocal tract
    val speechRate: Float = 0.85f,   // Slightly slower rate for natural child cadence
    val preferredDialect: LanguageDialect = LanguageDialect.GULF_ARABIC,
    val colorHex: Long = 0xFF6C5CE7,
    val isSelected: Boolean = false,
    val staggerDelayMs: Long = 50L   // Tiny offset for chorus group speech
) {
    companion object {
        val DEFAULT_CHARACTERS = listOf(
            ChildCharacter(
                id = "char_lulu",
                name = "Lulu",
                arabicName = "لولو",
                avatarEmoji = "👧",
                pitch = 1.55f,
                speechRate = 0.88f,
                preferredDialect = LanguageDialect.GULF_ARABIC,
                colorHex = 0xFFFD79A8,
                isSelected = true,
                staggerDelayMs = 0L
            ),
            ChildCharacter(
                id = "char_rashed",
                name = "Rashed",
                arabicName = "راشد",
                avatarEmoji = "👦",
                pitch = 1.45f,
                speechRate = 0.85f,
                preferredDialect = LanguageDialect.GULF_ARABIC,
                colorHex = 0xFF0984E3,
                isSelected = false,
                staggerDelayMs = 40L
            ),
            ChildCharacter(
                id = "char_noor",
                name = "Noor",
                arabicName = "نور",
                avatarEmoji = "👧🏽",
                pitch = 1.60f,
                speechRate = 0.90f,
                preferredDialect = LanguageDialect.EGYPTIAN_ARABIC,
                colorHex = 0xFF00CEC9,
                isSelected = false,
                staggerDelayMs = 80L
            ),
            ChildCharacter(
                id = "char_ali",
                name = "Ali",
                arabicName = "علي",
                avatarEmoji = "👦🏻",
                pitch = 1.40f,
                speechRate = 0.82f,
                preferredDialect = LanguageDialect.FUSHA_ARABIC,
                colorHex = 0xFF6C5CE7,
                isSelected = false,
                staggerDelayMs = 120L
            ),
            ChildCharacter(
                id = "char_sara",
                name = "Sara",
                arabicName = "سارة",
                avatarEmoji = "👧🏼",
                pitch = 1.50f,
                speechRate = 0.87f,
                preferredDialect = LanguageDialect.ENGLISH,
                colorHex = 0xFFE17055,
                isSelected = false,
                staggerDelayMs = 160L
            )
        )
    }
}
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/tts/TTSManager.kt',
    filename: 'TTSManager.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.tts

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.os.Build
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.speech.tts.Voice
import android.util.Log
import com.impacthubegypt.impactstudio.data.model.ChildCharacter
import com.impacthubegypt.impactstudio.data.model.LanguageDialect
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.Locale

/**
 * Singleton Audio & TextToSpeech Engine for Impact Studio.
 * Handles single character speech as well as multi-character simultaneous child chorus (group speech).
 */
class TTSManager private constructor(private val context: Context) : TextToSpeech.OnInitListener {

    private val TAG = "ImpactStudio_TTS"
    private val scope = CoroutineScope(Dispatchers.Main)

    private val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    private var audioFocusRequest: AudioFocusRequest? = null

    // Multiple TTS engines pooled for simultaneous group speech
    private val ttsEnginePool = mutableListOf<TextToSpeech>()
    private val poolSize = 5
    private var isInitialized = false

    private val _speakingState = MutableStateFlow(false)
    val speakingState: StateFlow<Boolean> = _speakingState.asStateFlow()

    private val _statusMessage = MutableStateFlow<String?>("TTS Engine Initializing…")
    val statusMessage: StateFlow<String?> = _statusMessage.asStateFlow()

    private var activeUtteranceCount = 0

    init {
        initializePool()
    }

    private fun initializePool() {
        var initializedCount = 0
        for (i in 0 until poolSize) {
            val tts = TextToSpeech(context.applicationContext) { status ->
                if (status == TextToSpeech.SUCCESS) {
                    initializedCount++
                    if (initializedCount >= poolSize) {
                        isInitialized = true
                        _statusMessage.value = "Studio Ready (5 TTS Engines Loaded)"
                        Log.d(TAG, "All 5 TTS instances successfully initialized.")
                    }
                } else {
                    _statusMessage.value = "TTS Initialization warning on engine #$i"
                }
            }
            configureAudioAttributes(tts)
            ttsEnginePool.add(tts)
        }
    }

    private fun configureAudioAttributes(tts: TextToSpeech) {
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_MEDIA)
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .build()
        tts.setAudioAttributes(audioAttributes)
    }

    override fun onInit(status: Int) {
        // Callback handled inline in pool initialization
    }

    /**
     * Finds the best voice matching dialect keywords, fallback to general locale
     */
    private fun findMatchingVoice(tts: TextToSpeech, dialect: LanguageDialect): Voice? {
        try {
            val voices = tts.voices
            if (!voices.isNullOrEmpty()) {
                // Search for matching voice name containing dialect keywords (e.g. "ar-xa", "ar-eg", "ar-ae")
                for (voice in voices) {
                    val nameLower = voice.name.lowercase()
                    val localeLower = voice.locale.toString().lowercase()
                    for (keyword in dialect.voiceKeywords) {
                        if (nameLower.contains(keyword) || localeLower.contains(keyword)) {
                            return voice
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error matching voice for dialect \${dialect.displayName}: \${e.message}")
        }
        return null
    }

    /**
     * Request Audio Focus before playback
     */
    private fun requestAudioFocus(): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val focusRequest = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build()
                )
                .setAcceptsDelayedFocusGain(false)
                .build()
            audioFocusRequest = focusRequest
            return audioManager.requestAudioFocus(focusRequest) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED
        } else {
            @Suppress("DEPRECATION")
            return audioManager.requestAudioFocus(
                null,
                AudioManager.STREAM_MUSIC,
                AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK
            ) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED
        }
    }

    /**
     * Abandon Audio Focus when speech ends
     */
    private fun releaseAudioFocus() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            audioFocusRequest?.let { audioManager.abandonAudioFocusRequest(it) }
        } else {
            @Suppress("DEPRECATION")
            audioManager.abandonAudioFocus(null)
        }
    }

    /**
     * Speaks text for a single child character or a group chorus of children
     */
    fun speak(
        text: String,
        characters: List<ChildCharacter>,
        dialect: LanguageDialect
    ) {
        if (!isInitialized || characters.isEmpty() || text.isBlank()) {
            _statusMessage.value = "Engine busy or no text/characters selected."
            return
        }

        stop()
        requestAudioFocus()
        _speakingState.value = true
        activeUtteranceCount = characters.size

        scope.launch {
            characters.forEachIndexed { index, character ->
                val engineIndex = index % ttsEnginePool.size
                val tts = ttsEnginePool[engineIndex]

                // Set Language / Dialect
                val matchedVoice = findMatchingVoice(tts, dialect)
                if (matchedVoice != null) {
                    tts.voice = matchedVoice
                } else {
                    val langResult = tts.setLanguage(dialect.primaryLocale)
                    if (langResult == TextToSpeech.LANG_MISSING_DATA || langResult == TextToSpeech.LANG_NOT_SUPPORTED) {
                        // Fallback to general Arabic if dialect missing
                        tts.setLanguage(Locale("ar"))
                    }
                }

                // Child Voice Modification (Pitch & Speed)
                tts.setPitch(character.pitch)
                tts.setSpeechRate(character.speechRate)

                // Stagger delay for group chorus effect (50ms per child)
                val staggerOffset = index * character.staggerDelayMs
                if (staggerOffset > 0) {
                    delay(staggerOffset)
                }

                val utteranceId = "utterance_\${character.id}_\${System.currentTimeMillis()}"

                tts.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(utteranceId: String?) {}

                    override fun onDone(utteranceId: String?) {
                        activeUtteranceCount--
                        if (activeUtteranceCount <= 0) {
                            _speakingState.value = false
                            releaseAudioFocus()
                        }
                    }

                    override fun onError(utteranceId: String?) {
                        activeUtteranceCount--
                        if (activeUtteranceCount <= 0) {
                            _speakingState.value = false
                            releaseAudioFocus()
                        }
                    }
                })

                val params = Bundle()
                params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, utteranceId)

                tts.speak(text, TextToSpeech.QUEUE_FLUSH, params, utteranceId)
            }
        }
    }

    /**
     * Stop all active speech playback
     */
    fun stop() {
        ttsEnginePool.forEach { tts ->
            try {
                tts.stop()
            } catch (e: Exception) {
                Log.e(TAG, "Error stopping TTS: \${e.message}")
            }
        }
        _speakingState.value = false
        releaseAudioFocus()
    }

    fun shutdown() {
        ttsEnginePool.forEach { tts ->
            tts.shutdown()
        }
        ttsEnginePool.clear()
        releaseAudioFocus()
    }

    companion object {
        @Volatile
        private var instance: TTSManager? = null

        fun getInstance(context: Context): TTSManager {
            return instance ?: synchronized(this) {
                instance ?: TTSManager(context.applicationContext).also { instance = it }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/ui/theme/Color.kt',
    filename: 'Color.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.ui.theme

import androidx.compose.ui.graphics.Color

// Impact Studio Playful Modern Palette
val PrimaryViolet = Color(0xFF6C5CE7)
val PrimaryLightViolet = Color(0xFFA29BFE)
val SecondaryTeal = Color(0xFF00CEC9)
val SecondaryLightTeal = Color(0xFF81ECEC)
val AccentPink = Color(0xFFFD79A8)
val AccentCoral = Color(0xFFE17055)
val AccentYellow = Color(0xFFFDCB6E)

val BackgroundLight = Color(0xFFFAFAFE)
val SurfaceLight = Color(0xFFFFFFFF)
val TextPrimary = Color(0xFF2D3436)
val TextSecondary = Color(0xFF636E72)
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/ui/theme/Type.kt',
    filename: 'Type.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        lineHeight = 28.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        lineHeight = 24.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 22.sp
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp
    )
)
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/ui/theme/Theme.kt',
    filename: 'Theme.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = PrimaryViolet,
    secondary = SecondaryTeal,
    tertiary = AccentPink,
    background = BackgroundLight,
    surface = SurfaceLight,
    onPrimary = SurfaceLight,
    onSecondary = SurfaceLight,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun ImpactStudioTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography,
        content = content
    )
}
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/ui/viewmodel/StudioViewModel.kt',
    filename: 'StudioViewModel.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.impacthubegypt.impactstudio.data.model.ChildCharacter
import com.impacthubegypt.impactstudio.data.model.LanguageDialect
import com.impacthubegypt.impactstudio.tts.TTSManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class StudioViewModel(application: Application) : AndroidViewModel(application) {

    private val ttsManager = TTSManager.getInstance(application)

    private val _inputText = MutableStateFlow("مرحباً بكم في إمباكت ستوديو! استمع لأصوات الأطفال الجميلة.")
    val inputText: StateFlow<String> = _inputText.asStateFlow()

    private val _selectedDialect = MutableStateFlow(LanguageDialect.GULF_ARABIC)
    val selectedDialect: StateFlow<LanguageDialect> = _selectedDialect.asStateFlow()

    private val _characters = MutableStateFlow(ChildCharacter.DEFAULT_CHARACTERS)
    val characters: StateFlow<List<ChildCharacter>> = _characters.asStateFlow()

    val isSpeaking: StateFlow<Boolean> = ttsManager.speakingState
    val statusMessage: StateFlow<String?> = ttsManager.statusMessage

    fun updateInputText(newText: String) {
        _inputText.value = newText
    }

    fun selectDialect(dialect: LanguageDialect) {
        _selectedDialect.value = dialect
        // Update input text with sample text if current text matches standard sample
        if (_inputText.value.isBlank()) {
            _inputText.value = dialect.defaultSampleText
        }
    }

    fun toggleCharacterSelection(characterId: String) {
        _characters.value = _characters.value.map { char ->
            if (char.id == characterId) {
                char.copy(isSelected = !char.isSelected)
            } else {
                char
            }
        }
    }

    fun updateCharacter(updatedChar: ChildCharacter) {
        _characters.value = _characters.value.map { char ->
            if (char.id == updatedChar.id) updatedChar else char
        }
    }

    fun playSpeech() {
        val selectedChars = _characters.value.filter { it.isSelected }
        val charsToPlay = if (selectedChars.isEmpty()) {
            // Default to first character if none explicitly checked
            listOf(_characters.value.first())
        } else {
            selectedChars
        }

        ttsManager.speak(
            text = _inputText.value,
            characters = charsToPlay,
            dialect = _selectedDialect.value
        )
    }

    fun stopSpeech() {
        ttsManager.stop()
    }

    override fun onCleared() {
        super.onCleared()
        ttsManager.stop()
    }
}
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/ui/components/AudioWaveform.kt',
    filename: 'AudioWaveform.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.impacthubegypt.impactstudio.ui.theme.PrimaryViolet

@Composable
fun AudioWaveform(isSpeaking: Boolean, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(48.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        val barCount = 12
        for (i in 0 until barCount) {
            val infiniteTransition = rememberInfiniteTransition(label = "waveform_$i")
            val targetHeight = if (isSpeaking) (16 + (i * 7) % 28).dp else 6.dp

            val animatedHeight by infiniteTransition.animateDp(
                initialValue = 6.dp,
                targetValue = targetHeight,
                animationSpec = infiniteRepeatable(
                    animation = tween(durationMillis = 300 + (i * 40) % 200, easing = LinearEasing),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "bar_height_$i"
            )

            Box(
                modifier = Modifier
                    .padding(horizontal = 3.dp)
                    .width(6.dp)
                    .height(if (isSpeaking) animatedHeight else 6.dp)
                    .background(
                        color = if (isSpeaking) PrimaryViolet else Color.LightGray,
                        shape = RoundedCornerShape(3.dp)
                    )
            )
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/ui/components/CharacterEditDialog.kt',
    filename: 'CharacterEditDialog.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.impacthubegypt.impactstudio.data.model.ChildCharacter
import java.util.Locale

@Composable
fun CharacterEditDialog(
    character: ChildCharacter,
    onDismiss: () -> Unit,
    onSave: (ChildCharacter) -> Unit
) {
    var name by remember { mutableStateOf(character.name) }
    var arabicName by remember { mutableStateOf(character.arabicName) }
    var pitch by remember { mutableFloatStateOf(character.pitch) }
    var speechRate by remember { mutableFloatStateOf(character.speechRate) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(text = "Edit \${character.avatarEmoji} \${character.name}") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("English Name") },
                    singleLine = true
                )
                OutlinedTextField(
                    value = arabicName,
                    onValueChange = { arabicName = it },
                    label = { Text("Arabic Name (الاسم بالعربية)") },
                    singleLine = true
                )

                Text(
                    text = "Pitch / High Tone: \${String.format(Locale.US, "%.2f", pitch)}x",
                    style = MaterialTheme.typography.bodyMedium
                )
                Slider(
                    value = pitch,
                    onValueChange = { pitch = it },
                    valueRange = 1.0f..2.0f
                )

                Text(
                    text = "Speed / Rate: \${String.format(Locale.US, "%.2f", speechRate)}x",
                    style = MaterialTheme.typography.bodyMedium
                )
                Slider(
                    value = speechRate,
                    onValueChange = { speechRate = it },
                    valueRange = 0.5f..1.5f
                )
            }
        },
        confirmButton = {
            Button(onClick = {
                onSave(
                    character.copy(
                        name = name,
                        arabicName = arabicName,
                        pitch = pitch,
                        speechRate = speechRate
                    )
                )
            }) {
                Text("Save Changes")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/ui/screens/SplashScreen.kt',
    filename: 'SplashScreen.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.impacthubegypt.impactstudio.ui.theme.PrimaryViolet
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(onTimeout: () -> Unit) {
    val scale = remember { Animatable(0.5f) }

    LaunchedEffect(key1 = true) {
        scale.animateTo(
            targetValue = 1.1f,
            animationSpec = tween(
                durationMillis = 800,
                easing = FastOutSlowInEasing
            )
        )
        scale.animateTo(
            targetValue = 1.0f,
            animationSpec = tween(durationMillis = 300)
        )
        delay(1200)
        onTimeout()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(PrimaryViolet),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.scale(scale.value)
        ) {
            Text(
                text = "👧🏻👦🏽🎙️",
                fontSize = 64.sp,
                modifier = Modifier.padding(bottom = 16.dp)
            )
            Text(
                text = "Impact Studio",
                style = MaterialTheme.typography.titleLarge.copy(
                    color = Color.White,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold
                )
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Children Voice Text-To-Speech Studio",
                style = MaterialTheme.typography.bodyLarge.copy(
                    color = Color.White.copy(alpha = 0.9f)
                )
            )
            Spacer(modifier = Modifier.height(32.dp))
            Text(
                text = "Developed by Impact Hub Egypt",
                style = MaterialTheme.typography.labelLarge.copy(
                    color = Color.White.copy(alpha = 0.75f)
                )
            )
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/ui/screens/MainScreen.kt',
    filename: 'MainScreen.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.impacthubegypt.impactstudio.data.model.ChildCharacter
import com.impacthubegypt.impactstudio.data.model.LanguageDialect
import com.impacthubegypt.impactstudio.ui.components.AudioWaveform
import com.impacthubegypt.impactstudio.ui.theme.PrimaryViolet
import com.impacthubegypt.impactstudio.ui.viewmodel.StudioViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(viewModel: StudioViewModel) {
    val inputText by viewModel.inputText.collectAsState()
    val selectedDialect by viewModel.selectedDialect.collectAsState()
    val characters by viewModel.characters.collectAsState()
    val isSpeaking by viewModel.isSpeaking.collectAsState()
    val statusMessage by viewModel.statusMessage.collectAsState()

    var dropdownExpanded by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Dialect Dropdown Selector
        ExposedDropdownMenuBox(
            expanded = dropdownExpanded,
            onExpandedChange = { dropdownExpanded = !dropdownExpanded }
        ) {
            OutlinedTextField(
                value = "\${selectedDialect.flagEmoji} \${selectedDialect.nativeName} (\${selectedDialect.displayName})",
                onValueChange = {},
                readOnly = true,
                label = { Text("Language / Arabic Dialect") },
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = dropdownExpanded) },
                modifier = Modifier
                    .menuAnchor()
                    .fillMaxWidth()
            )

            ExposedDropdownMenu(
                expanded = dropdownExpanded,
                onDismissRequest = { dropdownExpanded = false }
            ) {
                LanguageDialect.entries.forEach { dialect ->
                    DropdownMenuItem(
                        text = {
                            Text("\${dialect.flagEmoji} \${dialect.nativeName} (\${dialect.displayName})")
                        },
                        onClick = {
                            viewModel.selectDialect(dialect)
                            dropdownExpanded = false
                        }
                    )
                }
            }
        }

        // Text Input Field
        OutlinedTextField(
            value = inputText,
            onValueChange = { viewModel.updateInputText(it) },
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            label = { Text("Script Input") },
            placeholder = { Text("Type text here for children to read…") },
            shape = RoundedCornerShape(16.dp)
        )

        // Waveform indicator when speaking
        AudioWaveform(isSpeaking = isSpeaking)

        // Character Multi-Select Chips (Group Speech Chorus Selection)
        Column {
            Text(
                text = "Select Child Voice(s) for Group Chorus (النطق الجماعي):",
                style = MaterialTheme.typography.labelLarge,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(characters) { char ->
                    CharacterChipItem(
                        character = char,
                        onToggle = { viewModel.toggleCharacterSelection(char.id) }
                    )
                }
            }
        }

        // Action Play / Stop Button
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            ExtendedFloatingActionButton(
                onClick = {
                    if (isSpeaking) {
                        viewModel.stopSpeech()
                    } else {
                        viewModel.playSpeech()
                    }
                },
                containerColor = if (isSpeaking) Color(0xFFD63031) else PrimaryViolet,
                contentColor = Color.White,
                shape = RoundedCornerShape(24.dp)
            ) {
                Icon(
                    imageVector = if (isSpeaking) Icons.Default.Stop else Icons.Default.PlayArrow,
                    contentDescription = "Play/Stop"
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isSpeaking) "Stop Chorus" else "Play Speech (النطق)",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
            }
        }
    }
}

@Composable
fun CharacterChipItem(
    character: ChildCharacter,
    onToggle: () -> Unit
) {
    val backgroundColor = if (character.isSelected) Color(character.colorHex) else Color(0xFFF1F2F6)
    val contentColor = if (character.isSelected) Color.White else Color.DarkGray

    Card(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .clickable { onToggle() },
        colors = CardDefaults.cardColors(containerColor = backgroundColor)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = character.avatarEmoji, fontSize = 22.sp)
            Spacer(modifier = Modifier.width(8.dp))
            Column {
                Text(
                    text = character.arabicName,
                    color = contentColor,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
                Text(
                    text = character.name,
                    color = contentColor.copy(alpha = 0.8f),
                    fontSize = 12.sp
                )
            }
            if (character.isSelected) {
                Spacer(modifier = Modifier.width(8.dp))
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Selected",
                    tint = Color.White,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/ui/screens/CharactersScreen.kt',
    filename: 'CharactersScreen.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.impacthubegypt.impactstudio.data.model.ChildCharacter
import com.impacthubegypt.impactstudio.ui.components.CharacterEditDialog
import com.impacthubegypt.impactstudio.ui.viewmodel.StudioViewModel
import java.util.Locale

@Composable
fun CharactersScreen(viewModel: StudioViewModel) {
    val characters by viewModel.characters.collectAsState()
    var editingCharacter by remember { mutableStateOf<ChildCharacter?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Children Voice Roster (أصوات الأطفال)",
            style = MaterialTheme.typography.titleLarge,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(characters) { char ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF8F9FA))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                                .background(Color(char.colorHex).copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = char.avatarEmoji, fontSize = 28.sp)
                        }

                        Spacer(modifier = Modifier.width(16.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "\${char.arabicName} (\${char.name})",
                                fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.titleMedium
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Pitch: \${String.format(Locale.US, "%.2f", char.pitch)}x | Speed: \${String.format(Locale.US, "%.2f", char.speechRate)}x",
                                style = MaterialTheme.typography.bodyMedium,
                                color = Color.Gray
                            )
                        }

                        IconButton(onClick = { editingCharacter = char }) {
                            Icon(imageVector = Icons.Default.Edit, contentDescription = "Edit Character")
                        }
                    }
                }
            }
        }
    }

    editingCharacter?.let { char ->
        CharacterEditDialog(
            character = char,
            onDismiss = { editingCharacter = null },
            onSave = { updated ->
                viewModel.updateCharacter(updated)
                editingCharacter = null
            }
        )
    }
}
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/ui/screens/SettingsScreen.kt',
    filename: 'SettingsScreen.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.impacthubegypt.impactstudio.ui.theme.PrimaryViolet

@Composable
fun SettingsScreen() {
    var audioFocusEnabled by remember { mutableStateOf(true) }
    var highQualityAudio by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Studio Settings & Audio Engine",
            style = MaterialTheme.typography.titleLarge
        )

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF8F9FA))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = "Audio Focus Ducking", fontWeight = FontWeight.Bold)
                        Text(text = "Ducks background music when children speak", color = Color.Gray, fontSize = 12.sp)
                    }
                    Switch(
                        checked = audioFocusEnabled,
                        onCheckedChange = { audioFocusEnabled = it }
                    )
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = "High Quality Pitch Modulation", fontWeight = FontWeight.Bold)
                        Text(text = "Optimized float pitch algorithms for child tone", color = Color.Gray, fontSize = 12.sp)
                    }
                    Switch(
                        checked = highQualityAudio,
                        onCheckedChange = { highQualityAudio = it }
                    )
                }
            }
        }

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PrimaryViolet.copy(alpha = 0.1f))
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Impact Studio",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = PrimaryViolet
                )
                Text(
                    text = "Version 1.0.0 (Build 1)",
                    fontSize = 14.sp,
                    color = Color.DarkGray
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Developed by Impact Hub Egypt",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 14.sp,
                    color = PrimaryViolet
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "A specialized children voice text-to-speech engine supporting Gulf, Fusha, and Egyptian Arabic dialects along with English, French, and German.",
                    fontSize = 13.sp,
                    color = Color.Gray
                )
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/impacthubegypt/impactstudio/MainActivity.kt',
    filename: 'MainActivity.kt',
    category: 'kotlin',
    code: `package com.impacthubegypt.impactstudio

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.impacthubegypt.impactstudio.ui.screens.CharactersScreen
import com.impacthubegypt.impactstudio.ui.screens.MainScreen
import com.impacthubegypt.impactstudio.ui.screens.SettingsScreen
import com.impacthubegypt.impactstudio.ui.screens.SplashScreen
import com.impacthubegypt.impactstudio.ui.theme.ImpactStudioTheme
import com.impacthubegypt.impactstudio.ui.viewmodel.StudioViewModel

class MainActivity : ComponentActivity() {

    private val studioViewModel: StudioViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ImpactStudioTheme {
                var showSplash by remember { mutableStateOf(true) }

                if (showSplash) {
                    SplashScreen(onTimeout = { showSplash = false })
                } else {
                    MainAppLayout(studioViewModel)
                }
            }
        }
    }
}

@Composable
fun MainAppLayout(viewModel: StudioViewModel) {
    val navController = rememberNavController()
    var selectedItem by remember { mutableIntStateOf(0) }

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home") },
                    selected = selectedItem == 0,
                    onClick = {
                        selectedItem = 0
                        navController.navigate("main") {
                            popUpTo("main") { inclusive = true }
                        }
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Face, contentDescription = "Children") },
                    label = { Text("Children") },
                    selected = selectedItem == 1,
                    onClick = {
                        selectedItem = 1
                        navController.navigate("characters")
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                    label = { Text("Settings") },
                    selected = selectedItem == 2,
                    onClick = {
                        selectedItem = 2
                        navController.navigate("settings")
                    }
                )
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = "main",
            modifier = Modifier.padding(paddingValues)
        ) {
            composable("main") { MainScreen(viewModel) }
            composable("characters") { CharactersScreen(viewModel) }
            composable("settings") { SettingsScreen() }
        }
    }
}
`
  }
];
