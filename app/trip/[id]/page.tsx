import React from 'react';
import { Metadata } from 'next';
import TripLandingPage from './TripLandingPage';

interface TripPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: TripPageProps): Promise<Metadata> {
    const { id } = await params;
    const pageTitle = `Layover AI - Trip ${id}`;
    const pageDescription = '查看我的旅程！下載 Layover AI 獲得完整的 AI 智能行程規劃體驗。';

    return {
        title: pageTitle,
        description: pageDescription,
        openGraph: {
            title: pageTitle,
            description: pageDescription,
            images: ['https://www.layover-ai.com/web/image/website/1/logo'],
            url: `https://www.layover-ai.com/trip/${id}`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: pageTitle,
            description: pageDescription,
            images: ['https://www.layover-ai.com/web/image/website/1/logo'],
        },
        other: {
            'apple-itunes-app': `app-id=YOUR_APP_ID, app-argument=layover-ai://trip/${id}`,
        },
    };
}

export default async function TripPage({ params }: TripPageProps) {
    const { id } = await params;

    return (
        <TripLandingPage
            tripId={id}
            pageTitle={`Layover AI - Trip ${id}`}
            pageDescription="查看我的旅程！下載 Layover AI 獲得完整的 AI 智能行程規劃體驗。"
            appStoreUrl="https://apps.apple.com/app/layover-ai/idYOUR_APP_ID"
            playStoreUrl="https://play.google.com/store/apps/details?id=com.layover.ai"
        />
    );
}
