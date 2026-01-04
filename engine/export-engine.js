// Export Engine - محرك التصدير
class ExportEngine {
    constructor() {
        this.projectName = 'MotionAndroidUI';
        this.packageName = 'com.example.motionui';
    }

    // تصدير المشروع كاملاً
    exportProject() {
        const zip = new JSZip();
        
        // إنشاء هيكل المجلدات
        const uiFolder = zip.folder('ui');
        const themeFolder = zip.folder('theme');
        const motionFolder = zip.folder('motion');
        const componentsFolder = zip.folder('components');
        
        // الحصول على البيانات من المحركات
        const themeData = window.themeEngine ? window.themeEngine.getColorSchemeForExport() : {};
        const motionData = window.motionEngine ? window.motionEngine.getAnimationSettings() : {};
        const screenData = window.previewEngine ? window.previewEngine.getScreenDataForExport() : {};
        
        // توليد ملفات UI
        this.generateUIFiles(uiFolder, screenData, themeData, motionData);
        
        // توليد ملفات Theme
        this.generateThemeFiles(themeFolder, themeData);
        
        // توليد ملفات Motion
        this.generateMotionFiles(motionFolder, motionData);
        
        // توليد ملفات Components
        this.generateComponentFiles(componentsFolder, themeData);
        
        // توليد ملفات إضافية
        zip.file('dependencies.txt', this.generateDependencies());
        zip.file('README.md', this.generateReadme());
        
        // تنزيل الملف
        zip.generateAsync({ type: 'blob' }).then(content => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `${this.projectName}.zip`;
            link.click();
        });
    }

    // توليد ملفات UI
    generateUIFiles(folder, screenData, themeData, motionData) {
        const screens = ['SplashScreen', 'LoginScreen', 'HomeScreen', 'OnboardingScreen', 'SettingsScreen'];
        
        screens.forEach(screen => {
            const screenCode = this.generateScreenCode(screen, screenData, themeData, motionData);
            folder.file(`${screen}.kt`, screenCode);
        });
    }

    // توليد كود الشاشة
    generateScreenCode(screenName, screenData, themeData, motionData) {
        const packageDeclaration = `package ${this.packageName}.ui\n\n`;
        const imports = this.generateImports();
        
        switch(screenName) {
            case 'SplashScreen':
                return packageDeclaration + imports + this.generateSplashScreenCode(screenData, themeData, motionData);
            case 'LoginScreen':
                return packageDeclaration + imports + this.generateLoginScreenCode(screenData, themeData, motionData);
            case 'HomeScreen':
                return packageDeclaration + imports + this.generateHomeScreenCode(screenData, themeData, motionData);
            case 'OnboardingScreen':
                return packageDeclaration + imports + this.generateOnboardingScreenCode(screenData, themeData, motionData);
            case 'SettingsScreen':
                return packageDeclaration + imports + this.generateSettingsScreenCode(screenData, themeData, motionData);
            default:
                return '';
        }
    }

    // توليد الـ imports
    generateImports() {
        return `import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

`;
    }

    // توليد كود Splash Screen
    generateSplashScreenCode(screenData, themeData, motionData) {
        const splashData = screenData.screenData?.splash || { appName: 'تطبيقي', tagline: 'مرحباً بك', logoText: 'Logo' };
        
        return `@Composable
fun SplashScreen() {
    var visible by remember { mutableStateOf(false) }
    
    LaunchedEffect(Unit) {
        visible = true
    }
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'}),
                        Color(0xFF${themeData.colors?.primaryVariant?.substring(1) || '3700B3'})
                    )
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        AnimatedVisibility(
            visible = visible,
            enter = scaleIn(
                initialScale = 0.5f,
                animationSpec = tween(durationMillis = 1000)
            ) + fadeIn(animationSpec = tween(durationMillis = 1000))
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                // Logo
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .background(
                            color = Color.White.copy(alpha = 0.2f),
                            shape = RoundedCornerShape(20.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "${splashData.logoText}",
                        color = Color.White,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                
                Spacer(modifier = Modifier.height(20.dp))
                
                // App Name
                Text(
                    text = "${splashData.appName}",
                    color = Color.White,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold
                )
                
                Spacer(modifier = Modifier.height(10.dp))
                
                // Tagline
                Text(
                    text = "${splashData.tagline}",
                    color = Color.White.copy(alpha = 0.9f),
                    fontSize = 16.sp
                )
            }
        }
    }
}`;
    }

    // توليد كود Login Screen
    generateLoginScreenCode(screenData, themeData, motionData) {
        const loginData = screenData.screenData?.login || { 
            title: 'تسجيل الدخول', 
            emailLabel: 'البريد الإلكتروني', 
            passwordLabel: 'كلمة المرور',
            loginButton: 'دخول'
        };
        
        return `@Composable
fun LoginScreen() {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var visible by remember { mutableStateOf(false) }
    
    LaunchedEffect(Unit) {
        visible = true
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF${themeData.colors?.background?.substring(1) || 'FAFAFA'}))
            .padding(40.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(60.dp))
        
        // Title
        AnimatedVisibility(
            visible = visible,
            enter = slideInVertically(
                initialOffsetY = { -it / 3 },
                animationSpec = tween(durationMillis = 600)
            ) + fadeIn(animationSpec = tween(durationMillis = 600))
        ) {
            Text(
                text = "${loginData.title}",
                color = Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'}),
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold
            )
        }
        
        Spacer(modifier = Modifier.height(40.dp))
        
        // Email Field
        AnimatedVisibility(
            visible = visible,
            enter = slideInVertically(
                initialOffsetY = { it / 3 },
                animationSpec = tween(durationMillis = 600, delayMillis = 200)
            ) + fadeIn(animationSpec = tween(durationMillis = 600, delayMillis = 200))
        ) {
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("${loginData.emailLabel}") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp)
            )
        }
        
        Spacer(modifier = Modifier.height(20.dp))
        
        // Password Field
        AnimatedVisibility(
            visible = visible,
            enter = slideInVertically(
                initialOffsetY = { it / 3 },
                animationSpec = tween(durationMillis = 600, delayMillis = 400)
            ) + fadeIn(animationSpec = tween(durationMillis = 600, delayMillis = 400))
        ) {
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("${loginData.passwordLabel}") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp)
            )
        }
        
        Spacer(modifier = Modifier.height(30.dp))
        
        // Login Button
        AnimatedVisibility(
            visible = visible,
            enter = scaleIn(
                initialScale = 0.8f,
                animationSpec = tween(durationMillis = 600, delayMillis = 600)
            ) + fadeIn(animationSpec = tween(durationMillis = 600, delayMillis = 600))
        ) {
            Button(
                onClick = { /* Handle login */ },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                shape = RoundedCornerShape(25.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'})
                )
            ) {
                Text(
                    text = "${loginData.loginButton}",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}`;
    }

    // توليد كود Home Screen
    generateHomeScreenCode(screenData, themeData, motionData) {
        const homeData = screenData.screenData?.home || { 
            title: 'الرئيسية', 
            welcomeText: 'مرحباً بك',
            cards: ['البطاقة الأولى', 'البطاقة الثانية', 'البطاقة الثالثة']
        };
        
        return `@Composable
fun HomeScreen() {
    var visible by remember { mutableStateOf(false) }
    
    LaunchedEffect(Unit) {
        visible = true
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF${themeData.colors?.background?.substring(1) || 'FAFAFA'}))
    ) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'}))
                .padding(30.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                AnimatedVisibility(
                    visible = visible,
                    enter = slideInVertically(
                        initialOffsetY = { -it / 2 },
                        animationSpec = tween(durationMillis = 600)
                    ) + fadeIn(animationSpec = tween(durationMillis = 600))
                ) {
                    Text(
                        text = "${homeData.title}",
                        color = Color.White,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                
                AnimatedVisibility(
                    visible = visible,
                    enter = slideInVertically(
                        initialOffsetY = { -it / 2 },
                        animationSpec = tween(durationMillis = 600, delayMillis = 200)
                    ) + fadeIn(animationSpec = tween(durationMillis = 600, delayMillis = 200))
                ) {
                    Text(
                        text = "${homeData.welcomeText}",
                        color = Color.White.copy(alpha = 0.9f),
                        fontSize = 16.sp
                    )
                }
            }
        }
        
        // Content
        LazyColumn(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(15.dp)
        ) {
            itemsIndexed(listOf(${homeData.cards.map(card => `"${card}"`).join(', ')})) { index, card ->
                AnimatedVisibility(
                    visible = visible,
                    enter = slideInHorizontally(
                        initialOffsetX = { it / 2 },
                        animationSpec = tween(durationMillis = 600, delayMillis = 400 + (index * 100))
                    ) + fadeIn(animationSpec = tween(durationMillis = 600, delayMillis = 400 + (index * 100)))
                ) {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp)
                        ) {
                            Text(
                                text = card,
                                color = Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'}),
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Medium
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "وصف البطاقة",
                                color = Color(0xFF${themeData.colors?.onSurface?.substring(1) || '000000'}),
                                fontSize = 14.sp
                            )
                        }
                    }
                }
            }
        }
    }
}`;
    }

    // توليد كود Onboarding Screen
    generateOnboardingScreenCode(screenData, themeData, motionData) {
        return `@Composable
fun OnboardingScreen() {
    var currentPage by remember { mutableStateOf(0) }
    val pages = listOf(
        OnboardingPage("مرحباً", "اكتشف ميزات التطبيق الرائعة"),
        OnboardingPage("سهل الاستخدام", "واجهة بسيطة وسهلة"),
        OnboardingPage("ابدأ الآن", "جاهز للبدء؟")
    )
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF${themeData.colors?.background?.substring(1) || 'FAFAFA'}))
    ) {
        // Content
        Box(
            modifier = Modifier
                .weight(1f)
                .padding(40.dp),
            contentAlignment = Alignment.Center
        ) {
            AnimatedContent(
                targetState = currentPage,
                transitionSpec = {
                    slideInHorizontally { it } + fadeIn() with
                    slideOutHorizontally { -it } + fadeOut()
                }
            ) { page ->
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    // Image placeholder
                    Box(
                        modifier = Modifier
                            .size(120.dp)
                            .background(
                                brush = Brush.linearGradient(
                                    colors = listOf(
                                        Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'}),
                                        Color(0xFF${themeData.colors?.secondary?.substring(1) || '03DAC6'})
                                    )
                                ),
                                shape = RoundedCornerShape(60.dp)
                            )
                    )
                    
                    Spacer(modifier = Modifier.height(30.dp))
                    
                    Text(
                        text = pages[page].title,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF${themeData.colors?.onBackground?.substring(1) || '000000'}),
                        textAlign = TextAlign.Center
                    )
                    
                    Spacer(modifier = Modifier.height(15.dp))
                    
                    Text(
                        text = pages[page].description,
                        fontSize = 16.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center,
                        lineHeight = 24.sp
                    )
                }
            }
        }
        
        // Navigation
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Page indicators
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                repeat(pages.size) { index ->
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .background(
                                color = if (index == currentPage) 
                                    Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'}) 
                                else 
                                    Color.LightGray,
                                shape = RoundedCornerShape(4.dp)
                            )
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(20.dp))
            
            // Next button
            Button(
                onClick = { 
                    if (currentPage < pages.size - 1) {
                        currentPage++
                    }
                },
                shape = RoundedCornerShape(20.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'})
                )
            ) {
                Text(
                    text = if (currentPage < pages.size - 1) "التالي" else "ابدأ",
                    fontSize = 16.sp
                )
            }
        }
    }
}

data class OnboardingPage(
    val title: String,
    val description: String
)`;
    }

    // توليد كود Settings Screen
    generateSettingsScreenCode(screenData, themeData, motionData) {
        return `@Composable
fun SettingsScreen() {
    var visible by remember { mutableStateOf(false) }
    
    LaunchedEffect(Unit) {
        visible = true
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF${themeData.colors?.background?.substring(1) || 'FAFAFA'}))
    ) {
        // Header
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shadowElevation = 2.dp
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF${themeData.colors?.surface?.substring(1) || 'FFFFFF'}))
                    .padding(30.dp)
            ) {
                AnimatedVisibility(
                    visible = visible,
                    enter = slideInVertically(
                        initialOffsetY = { -it / 2 },
                        animationSpec = tween(durationMillis = 600)
                    ) + fadeIn(animationSpec = tween(durationMillis = 600))
                ) {
                    Text(
                        text = "الإعدادات",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF${themeData.colors?.onSurface?.substring(1) || '000000'})
                    )
                }
            }
        }
        
        // Content
        LazyColumn(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(30.dp)
        ) {
            item {
                AnimatedVisibility(
                    visible = visible,
                    enter = slideInHorizontally(
                        initialOffsetX = { -it / 2 },
                        animationSpec = tween(durationMillis = 600, delayMillis = 200)
                    ) + fadeIn(animationSpec = tween(durationMillis = 600, delayMillis = 200))
                ) {
                    SettingsSection(
                        title = "الحساب",
                        items = listOf("الملف الشخصي", "الخصوصية")
                    )
                }
            }
            
            item {
                AnimatedVisibility(
                    visible = visible,
                    enter = slideInHorizontally(
                        initialOffsetX = { -it / 2 },
                        animationSpec = tween(durationMillis = 600, delayMillis = 400)
                    ) + fadeIn(animationSpec = tween(durationMillis = 600, delayMillis = 400))
                ) {
                    SettingsSection(
                        title = "التطبيق",
                        items = listOf("الإشعارات", "اللغة")
                    )
                }
            }
        }
    }
}

@Composable
fun SettingsSection(
    title: String,
    items: List<String>
) {
    Column {
        Text(
            text = title,
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'}),
            modifier = Modifier.padding(bottom = 15.dp)
        )
        
        items.forEach { item ->
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp),
                shape = RoundedCornerShape(8.dp),
                shadowElevation = 1.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF${themeData.colors?.surface?.substring(1) || 'FFFFFF'}))
                        .padding(15.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = item,
                        fontSize = 14.sp,
                        color = Color(0xFF${themeData.colors?.onSurface?.substring(1) || '000000'})
                    )
                    
                    Switch(
                        checked = true,
                        onCheckedChange = { },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'})
                        )
                    )
                }
            }
        }
    }
}`;
    }

    // توليد ملفات Theme
    generateThemeFiles(folder, themeData) {
        // ColorScheme.kt
        const colorSchemeCode = `package ${this.packageName}.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

// Generated Color Scheme - ${themeData.preset || 'Default'} Preset
val LightColorScheme = lightColorScheme(
    primary = Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'}),
    onPrimary = Color(0xFF${themeData.colors?.onPrimary?.substring(1) || 'FFFFFF'}),
    primaryContainer = Color(0xFF${themeData.colors?.primaryVariant?.substring(1) || '3700B3'}),
    secondary = Color(0xFF${themeData.colors?.secondary?.substring(1) || '03DAC6'}),
    onSecondary = Color(0xFF${themeData.colors?.onSecondary?.substring(1) || '000000'}),
    background = Color(0xFF${themeData.colors?.background?.substring(1) || 'FAFAFA'}),
    onBackground = Color(0xFF${themeData.colors?.onBackground?.substring(1) || '000000'}),
    surface = Color(0xFF${themeData.colors?.surface?.substring(1) || 'FFFFFF'}),
    onSurface = Color(0xFF${themeData.colors?.onSurface?.substring(1) || '000000'}),
    error = Color(0xFF${themeData.colors?.error?.substring(1) || 'B00020'}),
    onError = Color(0xFF${themeData.colors?.onError?.substring(1) || 'FFFFFF'})
)

val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF${themeData.colors?.primary?.substring(1) || 'BB86FC'}),
    onPrimary = Color(0xFF000000),
    primaryContainer = Color(0xFF${themeData.colors?.primaryVariant?.substring(1) || '3700B3'}),
    secondary = Color(0xFF${themeData.colors?.secondary?.substring(1) || '03DAC6'}),
    onSecondary = Color(0xFF000000),
    background = Color(0xFF121212),
    onBackground = Color(0xFFFFFFFF),
    surface = Color(0xFF1E1E1E),
    onSurface = Color(0xFFFFFFFF),
    error = Color(0xFFCF6679),
    onError = Color(0xFF000000)
)`;
        
        folder.file('ColorScheme.kt', colorSchemeCode);
        
        // Typography.kt
        const typographyCode = `package ${this.packageName}.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 57.sp,
        lineHeight = 64.sp,
        letterSpacing = (-0.25).sp,
    ),
    displayMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 45.sp,
        lineHeight = 52.sp,
        letterSpacing = 0.sp,
    ),
    displaySmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 36.sp,
        lineHeight = 44.sp,
        letterSpacing = 0.sp,
    ),
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 32.sp,
        lineHeight = 40.sp,
        letterSpacing = 0.sp,
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 28.sp,
        lineHeight = 36.sp,
        letterSpacing = 0.sp,
    ),
    headlineSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 24.sp,
        lineHeight = 32.sp,
        letterSpacing = 0.sp,
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp,
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.15.sp,
    ),
    titleSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.1.sp,
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.15.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.25.sp,
    ),
    bodySmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.4.sp,
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.1.sp,
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp,
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp,
    )
)`;
        
        folder.file('Typography.kt', typographyCode);
    }

    // توليد ملفات Motion
    generateMotionFiles(folder, motionData) {
        const motionCode = `package ${this.packageName}.motion

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.runtime.Composable

object MotionPresets {
    
    // Current Animation: ${motionData.type || 'fade-slide'}
    val defaultEnterTransition = ${this.getComposeEnterTransition(motionData.type)}
    
    val defaultExitTransition = ${this.getComposeExitTransition(motionData.type)}
    
    // Button Press Animation
    val buttonPressScale = spring<Float>(
        dampingRatio = Spring.DampingRatioMediumBouncy,
        stiffness = Spring.StiffnessLow
    )
    
    // Page Transition
    val pageTransitionSpec: AnimatedContentTransitionScope<*>.() -> ContentTransform = {
        slideInHorizontally(
            initialOffsetX = { it },
            animationSpec = tween(durationMillis = ${motionData.duration || 300})
        ) + fadeIn(
            animationSpec = tween(durationMillis = ${motionData.duration || 300})
        ) with slideOutHorizontally(
            targetOffsetX = { -it },
            animationSpec = tween(durationMillis = ${motionData.duration || 300})
        ) + fadeOut(
            animationSpec = tween(durationMillis = ${motionData.duration || 300})
        )
    }
    
    // Stagger Animation
    fun staggeredDelay(index: Int): Int = index * ${motionData.staggerDelay || 100}
}

@Composable
fun AnimatedButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    var pressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(
        targetValue = if (pressed) 0.95f else 1f,
        animationSpec = MotionPresets.buttonPressScale
    )
    
    Box(
        modifier = modifier
            .scale(scale)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) {
                pressed = true
                onClick()
                pressed = false
            }
    ) {
        content()
    }
}`;
        
        folder.file('MotionPresets.kt', motionCode);
    }

    // توليد ملفات Components
    generateComponentFiles(folder, themeData) {
        // Buttons.kt
        const buttonsCode = `package ${this.packageName}.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun GradientButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    text: String,
    enabled: Boolean = true
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .height(50.dp)
            .clip(RoundedCornerShape(25.dp))
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'}),
                        Color(0xFF${themeData.colors?.primaryVariant?.substring(1) || '3700B3'})
                    )
                )
            ),
        enabled = enabled,
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Transparent
        ),
        contentPadding = PaddingValues(0.dp)
    ) {
        Text(
            text = text,
            color = Color.White
        )
    }
}

@Composable
fun GlassButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    text: String,
    enabled: Boolean = true
) {
    Button(
        onClick = onClick,
        modifier = modifier.height(50.dp),
        enabled = enabled,
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.White.copy(alpha = 0.2f)
        ),
        shape = RoundedCornerShape(25.dp)
    ) {
        Text(
            text = text,
            color = Color.White
        )
    }
}

@Composable
fun ElevatedMotionButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    text: String,
    enabled: Boolean = true
) {
    ElevatedButton(
        onClick = onClick,
        modifier = modifier.height(50.dp),
        enabled = enabled,
        elevation = ButtonDefaults.elevatedButtonElevation(
            defaultElevation = 8.dp,
            pressedElevation = 12.dp
        ),
        colors = ButtonDefaults.elevatedButtonColors(
            containerColor = Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'})
        ),
        shape = RoundedCornerShape(25.dp)
    ) {
        Text(
            text = text,
            color = Color.White
        )
    }
}`;
        
        folder.file('Buttons.kt', buttonsCode);
        
        // Cards.kt
        const cardsCode = `package ${this.packageName}.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun MotionCard(
    title: String,
    description: String,
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        onClick = onClick ?: {}
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Text(
                text = title,
                color = Color(0xFF${themeData.colors?.primary?.substring(1) || '6200EE'}),
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = description,
                color = Color(0xFF${themeData.colors?.onSurface?.substring(1) || '000000'}),
                fontSize = 14.sp
            )
        }
    }
}

@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.1f)
        )
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            content = content
        )
    }
}`;
        
        folder.file('Cards.kt', cardsCode);
    }

    // الحصول على Compose Enter Transition
    getComposeEnterTransition(type) {
        switch(type) {
            case 'fade-slide':
                return `slideInVertically(
        initialOffsetY = { it / 3 },
        animationSpec = tween(durationMillis = 300)
    ) + fadeIn(animationSpec = tween(durationMillis = 300))`;
            case 'scale-reveal':
                return `scaleIn(
        initialScale = 0.8f,
        animationSpec = tween(durationMillis = 300)
    ) + fadeIn(animationSpec = tween(durationMillis = 300))`;
            case 'staggered':
                return `slideInHorizontally(
        initialOffsetX = { -it / 4 },
        animationSpec = tween(durationMillis = 300)
    ) + fadeIn(animationSpec = tween(durationMillis = 300))`;
            case 'bounce':
                return `slideInVertically(
        initialOffsetY = { -it / 4 },
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy)
    ) + scaleIn(
        initialScale = 0.9f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy)
    )`;
            default:
                return `fadeIn(animationSpec = tween(durationMillis = 300))`;
        }
    }

    // الحصول على Compose Exit Transition
    getComposeExitTransition(type) {
        switch(type) {
            case 'fade-slide':
                return `slideOutVertically(
        targetOffsetY = { -it / 3 },
        animationSpec = tween(durationMillis = 300)
    ) + fadeOut(animationSpec = tween(durationMillis = 300))`;
            case 'scale-reveal':
                return `scaleOut(
        targetScale = 0.8f,
        animationSpec = tween(durationMillis = 300)
    ) + fadeOut(animationSpec = tween(durationMillis = 300))`;
            case 'staggered':
                return `slideOutHorizontally(
        targetOffsetX = { it / 4 },
        animationSpec = tween(durationMillis = 300)
    ) + fadeOut(animationSpec = tween(durationMillis = 300))`;
            case 'bounce':
                return `slideOutVertically(
        targetOffsetY = { it / 4 },
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy)
    ) + scaleOut(
        targetScale = 0.9f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy)
    )`;
            default:
                return `fadeOut(animationSpec = tween(durationMillis = 300))`;
        }
    }

    // توليد ملف Dependencies
    generateDependencies() {
        return `// Generated Dependencies for Motion Android UI Studio Project

// Core Compose Dependencies
implementation("androidx.compose.ui:ui:1.5.4")
implementation("androidx.compose.ui:ui-tooling-preview:1.5.4")
implementation("androidx.compose.material3:material3:1.1.2")
implementation("androidx.activity:activity-compose:1.8.0")

// Animation Dependencies
implementation("androidx.compose.animation:animation:1.5.4")
implementation("androidx.compose.animation:animation-core:1.5.4")

// Navigation (if needed)
implementation("androidx.navigation:navigation-compose:2.7.4")

// ViewModel
implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")

// Optional: For advanced animations
implementation("androidx.compose.animation:animation-graphics:1.5.4")

// Testing
androidTestImplementation("androidx.compose.ui:ui-test-junit4:1.5.4")
debugImplementation("androidx.compose.ui:ui-tooling:1.5.4")
debugImplementation("androidx.compose.ui:ui-test-manifest:1.5.4")`;
    }

    // توليد ملف README
    generateReadme() {
        return `# Motion Android UI Studio - Generated Project

تم إنشاء هذا المشروع باستخدام Motion Android UI Studio - أداة تصميم شاشات Android احترافية.

## 📱 الشاشات المُولدة

- **SplashScreen.kt** - شاشة البداية مع أنيميشن احترافي
- **LoginScreen.kt** - شاشة تسجيل الدخول العصرية
- **HomeScreen.kt** - الشاشة الرئيسية مع البطاقات
- **OnboardingScreen.kt** - شاشات التعريف بالتطبيق
- **SettingsScreen.kt** - شاشة الإعدادات الحديثة

## 🎨 نظام التصميم

### الألوان
تم توليد مخطط ألوان متكامل يتضمن:
- ألوان أساسية وثانوية
- ألوان الخلفية والسطح
- ألوان النصوص
- دعم الوضع المظلم

### الحركات
- أنيميشن دخول وخروج للعناصر
- حركات الأزرار التفاعلية
- انتقالات الصفحات السلسة
- تأثيرات Stagger للقوائم

## 🚀 كيفية الاستخدام

### 1. إضافة المكتبات
انسخ محتوى \`dependencies.txt\` إلى ملف \`build.gradle\` الخاص بالتطبيق:

\`\`\`gradle
dependencies {
    // المكتبات المطلوبة موجودة في dependencies.txt
}
\`\`\`

### 2. إضافة الملفات
1. انسخ مجلد \`ui/\` إلى مشروعك
2. انسخ مجلد \`theme/\` إلى مشروعك  
3. انسخ مجلد \`motion/\` إلى مشروعك
4. انسخ مجلد \`components/\` إلى مشروعك

### 3. تطبيق الثيم
في \`MainActivity.kt\`:

\`\`\`kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MotionUITheme {
                // استخدم الشاشات هنا
                SplashScreen()
            }
        }
    }
}
\`\`\`

### 4. إنشاء ملف الثيم الرئيسي
أنشئ ملف \`Theme.kt\`:

\`\`\`kotlin
@Composable
fun MotionUITheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
\`\`\`

## 🎯 الميزات المتقدمة

### الأزرار المخصصة
\`\`\`kotlin
// زر متدرج
GradientButton(
    onClick = { /* الإجراء */ },
    text = "زر متدرج"
)

// زر زجاجي
GlassButton(
    onClick = { /* الإجراء */ },
    text = "زر زجاجي"
)
\`\`\`

### البطاقات المخصصة
\`\`\`kotlin
MotionCard(
    title = "عنوان البطاقة",
    description = "وصف البطاقة",
    onClick = { /* الإجراء */ }
)
\`\`\`

### الأنيميشن المخصص
\`\`\`kotlin
AnimatedVisibility(
    visible = isVisible,
    enter = MotionPresets.defaultEnterTransition,
    exit = MotionPresets.defaultExitTransition
) {
    // المحتوى
}
\`\`\`

## 📋 متطلبات النظام

- Android Studio Arctic Fox أو أحدث
- Kotlin 1.8.0 أو أحدث
- Compose BOM 2023.10.01 أو أحدث
- compileSdk 34 أو أحدث

## 🔧 التخصيص

### تغيير الألوان
عدّل ملف \`ColorScheme.kt\` لتخصيص الألوان حسب احتياجاتك.

### تخصيص الأنيميشن
عدّل ملف \`MotionPresets.kt\` لتغيير سرعة ونوع الحركات.

### إضافة شاشات جديدة
استخدم الشاشات الموجودة كقالب لإنشاء شاشات جديدة.

## 📞 الدعم

تم إنشاء هذا المشروع بواسطة Motion Android UI Studio.
للمزيد من المعلومات، قم بزيارة الموقع الرسمي.

---

**ملاحظة:** جميع الملفات جاهزة للاستخدام المباشر في Android Studio بدون تعديل.`;
    }
}

// دالة التصدير العامة
function exportProject() {
    if (window.exportEngine) {
        window.exportEngine.exportProject();
    } else {
        alert('محرك التصدير غير متاح');
    }
}

// إضافة مكتبة JSZip
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.head.appendChild(script);

script.onload = function() {
    // إنشاء مثيل عام بعد تحميل JSZip
    window.exportEngine = new ExportEngine();
};