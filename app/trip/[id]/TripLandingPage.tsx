'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

interface TripLandingPageProps {
    tripId: string;
    pageTitle: string;
    pageDescription: string;
    appStoreUrl: string;
    playStoreUrl: string;
}

export default function TripLandingPage({
    tripId,
    pageTitle,
    pageDescription,
    appStoreUrl,
    playStoreUrl
}: TripLandingPageProps) {

    const tryOpenApp = () => {
        if (!tripId) {
            alert('無效的行程連結');
            return;
        }

        console.log('=== Starting app opening attempt ===');
        console.log('Trip ID:', tripId);
        console.log('User Agent:', navigator.userAgent);
        console.log('Platform:', navigator.platform);

        const loading = document.querySelector('.loading') as HTMLElement;
        const buttons = document.querySelector('.cta-buttons') as HTMLElement;

        // Show loading state
        if (loading) {
            loading.style.display = 'block';
            console.log('Loading state shown');
        }
        if (buttons) {
            buttons.style.display = 'none';
            console.log('Buttons hidden');
        }

        // Try different URL schemes - you may need to adjust this to match your app's actual scheme
        const appUrl = `layover-ai://trip/${tripId}`;
        const alternativeUrls = [
            `layoverai://trip/${tripId}`,
            `com.layover.ai://trip/${tripId}`,
            `layover://trip/${tripId}`
        ];
        console.log('Primary App URL:', appUrl);
        console.log('Alternative URLs:', alternativeUrls);

        let hasAttemptedOpen = false;
        let fallbackTimer: NodeJS.Timeout;

        // Function to reset UI
        const resetUI = () => {
            if (loading) loading.style.display = 'none';
            if (buttons) buttons.style.display = 'flex';
            console.log('UI reset to normal state');
        };

        // Function to handle app opening success
        const handleAppOpened = () => {
            console.log('App appears to have opened successfully');
            hasAttemptedOpen = true;
            if (fallbackTimer) clearTimeout(fallbackTimer);
        };

        // Set up page visibility change detection
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log('Page became hidden - app likely opened');
                handleAppOpened();
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            }
        };

        // Set up blur detection (another way to detect app opening)
        const handleBlur = () => {
            console.log('Window lost focus - app might have opened');
            setTimeout(() => {
                if (!document.hasFocus()) {
                    console.log('Window still doesn\'t have focus after 500ms');
                    handleAppOpened();
                }
            }, 500);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        // Function to try opening with a specific URL
        const tryOpenWithUrl = (url: string, methodName: string) => {
            console.log(`Attempting ${methodName} with URL:`, url);

            try {
                // Method 1: Direct assignment
                window.location.href = url;
                console.log(`${methodName}: window.location.href set successfully`);
                return true;
            } catch (e) {
                console.error(`${methodName} failed:`, e);
                return false;
            }
        };

        // Try primary URL first
        console.log('Attempting Method 1: Direct window.location with primary URL');
        if (!tryOpenWithUrl(appUrl, 'Primary URL')) {
            // If primary fails, try alternatives
            console.log('Primary URL failed, trying alternatives...');

            setTimeout(() => {
                if (!hasAttemptedOpen) {
                    alternativeUrls.forEach((altUrl, index) => {
                        setTimeout(() => {
                            if (!hasAttemptedOpen) {
                                tryOpenWithUrl(altUrl, `Alternative ${index + 1}`);
                            }
                        }, index * 200);
                    });
                }
            }, 500);
        }

        // Method 2: Universal Link fallback (using your domain)
        setTimeout(() => {
            if (!hasAttemptedOpen) {
                console.log('Attempting Method 2: Universal Link');
                try {
                    // This uses your actual domain which should work with Apple App Site Association
                    const universalLink = `https://www.layover-ai.com/trip/${tripId}`;
                    console.log('Universal Link:', universalLink);
                    window.location.href = universalLink;
                } catch (e) {
                    console.error('Universal Link failed:', e);
                }
            }
        }, 1500);

        // Method 3: App Store fallback
        setTimeout(() => {
            if (!hasAttemptedOpen) {
                console.log('Attempting Method 3: Direct to App Store');
                try {
                    window.location.href = appStoreUrl;
                } catch (e) {
                    console.error('App Store redirect failed:', e);
                }
            }
        }, 2500);

        // Fallback after 3 seconds
        fallbackTimer = setTimeout(() => {
            console.log('Fallback timer triggered');

            // Clean up event listeners
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);

            if (!hasAttemptedOpen) {
                resetUI();

                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                console.log('Is localhost:', isLocalhost);
                console.log('Is mobile:', isMobile);

                if (isLocalhost && isMobile) {
                    alert('模擬器/開發環境檢測：深度連結在模擬器中可能無法正常工作。請在真實設備上測試，或手動打開 Layover AI 應用程式。\n\n嘗試的連結: ' + appUrl);
                } else if (!isMobile) {
                    alert('桌面瀏覽器檢測：深度連結主要適用於行動裝置。請在手機上開啟此連結，或直接下載 Layover AI 應用程式。');
                } else {
                    if (confirm('無法開啟 Layover AI 應用程式。可能是因為應用程式尚未安裝。要前往 App Store 下載嗎？')) {
                        window.location.href = appStoreUrl;
                    }
                }
            }
        }, 3000);
    };

    useEffect(() => {
        // Debug info
        console.log('=== TripLandingPage Component Loaded ===');
        console.log('TripLandingPage loaded with tripId:', tripId);
        console.log('User Agent:', navigator.userAgent);
        console.log('Location:', window.location.href);

        // Test if functions are working
        console.log('tryOpenApp function:', typeof tryOpenApp);

        // Auto-attempt to open app on page load for mobile devices
        const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);
        console.log('Is Mobile:', isMobile);

        // Disable auto-opening for now to test manual clicks
        // if (isMobile) {
        //     // Small delay to ensure page is fully loaded
        //     console.log('Will attempt to open app in 1 second...');
        //     setTimeout(() => {
        //         console.log('Auto-opening app now...');
        //         tryOpenApp();
        //     }, 1000);
        // }
    }, [tripId]);

    // Styles as objects for better TypeScript support
    const containerStyle: React.CSSProperties = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };

    const cardStyle: React.CSSProperties = {
        maxWidth: '400px',
        padding: '2rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    };

    const logoStyle: React.CSSProperties = {
        width: '80px',
        height: '80px',
        margin: '0 auto 1.5rem',
        background: 'white',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        overflow: 'hidden'
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '2rem',
        marginBottom: '1rem',
        fontWeight: 700
    };

    const descriptionStyle: React.CSSProperties = {
        fontSize: '1.1rem',
        marginBottom: '2rem',
        opacity: 0.9,
        lineHeight: 1.6
    };

    const buttonsStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    };

    const btnBaseStyle: React.CSSProperties = {
        padding: '1rem 2rem',
        border: 'none',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 10,
        position: 'relative'
    };

    const btnPrimaryStyle: React.CSSProperties = {
        ...btnBaseStyle,
        background: 'white',
        color: '#667eea'
    };

    const btnSecondaryStyle: React.CSSProperties = {
        ...btnBaseStyle,
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)'
    };

    const loadingStyle: React.CSSProperties = {
        display: 'none',
        marginTop: '1rem'
    };

    const spinnerStyle: React.CSSProperties = {
        width: '40px',
        height: '40px',
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
    };

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @media (max-width: 480px) {
                        .trip-card-responsive {
                            margin: 1rem !important;
                            padding: 1.5rem !important;
                        }
                        
                        .trip-title-responsive {
                            font-size: 1.5rem !important;
                        }
                        
                        .trip-description-responsive {
                            font-size: 1rem !important;
                        }
                    }
                `}
            </style>

            <div style={containerStyle}>
                <div style={cardStyle} className="trip-card-responsive">
                    <div style={logoStyle}>
                        <Image
                            src="/icon.png"
                            alt="Layover AI"
                            width={70}
                            height={70}
                            style={{
                                borderRadius: '16px',
                                objectFit: 'cover'
                            }}
                            onLoad={() => {
                                console.log('Icon loaded successfully');
                            }}
                            onError={(e) => {
                                console.log('Icon failed to load, falling back to emoji');
                                // Fallback to emoji if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                if (target.parentElement) {
                                    target.parentElement.innerHTML = '✈️';
                                    target.parentElement.style.fontSize = '2rem';
                                }
                            }}
                        />
                    </div>
                    <h1 style={titleStyle} className="trip-title-responsive">Layover AI</h1>
                    <p style={descriptionStyle} className="trip-description-responsive">{pageDescription}</p>

                    <div style={buttonsStyle}>
                        <button
                            style={btnPrimaryStyle}
                            onClick={(e) => {
                                console.log('=== Primary button clicked ===');
                                console.log('Event:', e);
                                console.log('tripId:', tripId);
                                e.preventDefault();
                                tryOpenApp();
                            }}
                        >
                            打開 Layover AI
                        </button>

                        <button
                            style={{ ...btnSecondaryStyle, fontSize: '0.9rem', padding: '0.8rem 1.5rem' }}
                            onClick={(e) => {
                                console.log('=== Universal Link button clicked ===');
                                console.log('tripId value:', tripId);
                                e.preventDefault();
                                const universalLink = `https://www.layover-ai.com/trip/${tripId}`;
                                console.log('Trying Universal Link:', universalLink);
                                window.location.href = universalLink;
                            }}
                        >
                            🌐 通用連結 (Universal Link)
                        </button>

                        <button
                            style={{ ...btnSecondaryStyle, fontSize: '0.9rem', padding: '0.8rem 1.5rem', backgroundColor: '#4CAF50' }}
                            onClick={(e) => {
                                console.log('=== Direct App Open Test ===');
                                console.log('tripId value:', tripId);
                                e.preventDefault();

                                // Try multiple app opening methods immediately
                                const schemes = [
                                    `layover-ai://trip/${tripId}`,
                                    `layoverai://trip/${tripId}`,
                                    `com.layover.ai://trip/${tripId}`,
                                    `layover://trip/${tripId}`,
                                    `layoverapp://trip/${tripId}`
                                ];

                                schemes.forEach((scheme, index) => {
                                    setTimeout(() => {
                                        console.log(`Trying scheme ${index + 1}:`, scheme);
                                        try {
                                            window.location.href = scheme;
                                        } catch (error) {
                                            console.log(`Scheme ${index + 1} failed:`, error);
                                        }
                                    }, index * 100);
                                });

                                // Show feedback
                                alert(`正在嘗試打開應用程式...\n行程ID: ${tripId}\n如果沒有反應，請確認應用程式已安裝。`);
                            }}
                        >
                            📱 直接打開應用程式 (測試)
                        </button>

                        <button
                            style={{ ...btnSecondaryStyle, fontSize: '0.9rem', padding: '0.8rem 1.5rem', backgroundColor: '#FF9800' }}
                            onClick={(e) => {
                                console.log('=== Smart App Opening ===');
                                console.log('tripId value:', tripId);
                                e.preventDefault();

                                const userAgent = navigator.userAgent;
                                const isIOS = /iPad|iPhone|iPod/.test(userAgent);
                                const isAndroid = /Android/.test(userAgent);

                                console.log('Device detection:', { isIOS, isAndroid, userAgent });

                                if (isIOS) {
                                    // For iOS, try app scheme first, then fallback to App Store
                                    console.log('iOS detected - trying app scheme');
                                    const iosScheme = `layover-ai://trip/${tripId}`;

                                    // Create a hidden iframe for iOS
                                    const iframe = document.createElement('iframe');
                                    iframe.style.display = 'none';
                                    iframe.src = iosScheme;
                                    document.body.appendChild(iframe);

                                    setTimeout(() => {
                                        document.body.removeChild(iframe);
                                        console.log('iOS scheme attempted');
                                    }, 1000);

                                } else if (isAndroid) {
                                    // For Android, try intent URL
                                    console.log('Android detected - trying intent URL');
                                    const intentUrl = `intent://trip/${tripId}#Intent;scheme=layover-ai;package=com.layover.ai;end`;
                                    console.log('Android intent URL:', intentUrl);
                                    window.location.href = intentUrl;

                                } else {
                                    // Desktop or other - just try the scheme
                                    console.log('Desktop/Other detected - trying basic scheme');
                                    window.location.href = `layover-ai://trip/${tripId}`;
                                }

                                alert(`智能應用程式開啟嘗試\n平台: ${isIOS ? 'iOS' : isAndroid ? 'Android' : '桌面'}\n行程ID: ${tripId}`);
                            }}
                        >
                            🧠 智能打開應用程式
                        </button>

                        <button
                            style={{ ...btnSecondaryStyle, fontSize: '0.9rem', padding: '0.8rem 1.5rem' }}
                            onClick={(e) => {
                                console.log('=== Debug button clicked ===');
                                console.log('Event:', e);
                                console.log('Direct URL attempt:', `layover-ai://trip/${tripId}`);
                                alert('Debug button clicked! Check console for logs.');
                                e.preventDefault();
                                window.location.href = `layover-ai://trip/${tripId}`;
                            }}
                        >
                            🐛 直接測試深度連結
                        </button>

                        <a href={appStoreUrl} style={btnSecondaryStyle}>
                            從 App Store 下載
                        </a>
                        <a href={playStoreUrl} style={btnSecondaryStyle}>
                            從 Google Play 下載
                        </a>
                    </div>

                    <div className="loading" style={loadingStyle}>
                        <div style={spinnerStyle}></div>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>正在嘗試打開應用程式...</p>
                    </div>
                </div>
            </div>
        </>
    );
}
