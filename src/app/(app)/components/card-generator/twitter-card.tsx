import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names
import ImageLayout from '../ImageLayout';
import XLogo from '@assets/x-logo.svg';
import * as _ from "lodash-es"
import { formatTimestamp } from '@src/app/utils/format';
import type { CardStore, XConfig } from '@src/hooks/useCardStore';

interface TwitterCardProps {
    xConfig: XConfig[],
    backgroundStyles: CardStore['backgroundStyles'],
    cardStyles: CardStore['cardStyles'],
}

export const TwitterCard: React.FC<TwitterCardProps> = ({ xConfig, backgroundStyles, cardStyles }) => {
    const card = useMemo(() => {
        const controls = cardStyles.controls;
        return (
            <div className='flex flex-col gap-y-4 relative'>
                {
                    xConfig.map((config, index) => (
                        <div className="flex flex-col h-full" key={`xConfig-${index}`}>
                            <CardHeader xConfig={config} controls={controls} />
                            <CardBody xConfig={config} cardStyles={cardStyles} />
                            {controls.showFooter && (<CardFooter xConfig={config} />)}
                        </div>
                    ))
                }
                <div className=' absolute right-0 bottom-0 opacity-40 text-[##6d6d6d]'>
                    ∙ Made with x-cards.net
                </div>
            </div>
        )
    }, [backgroundStyles, xConfig, cardStyles]);

    return (
        <div
            id="card"
            //  aspect-video
            className="flex h-fit"
            style={{
                boxShadow: 'rgba(245, 208, 254, 0.3) 0px 0px 200px',
                width: cardStyles.width,
            }}
        >
            <div className="relative w-full grid place-items-center mobile-scaling pointer-events-none">

                <div className=" overflow-hidden w-full h-full relative content-shadow">
                    <div
                        id="content"
                        className="grid place-items-center content-container transition-colors h-full w-full"
                        style={{
                            padding: backgroundStyles.padding || 0,
                            fontSize: 14,
                            perspective: 1000
                        }}
                    >
                        {/* Background layers */}
                        <BackgroundLayers backgroundStyles={backgroundStyles} cardStyles={cardStyles} />

                        {/* Card container */}
                        <div
                            className="relative z-20 transition-all w-full card-holder"
                            style={{
                                transform: `scale(${cardStyles.scale}%)`,
                                // pointer-events: none;
                                // fontFamily: cardStyles?.fontFamily && `'${cardStyles?.fontFamily}', sans-serif`,
                                // fontFamily: 'ui-sans-serif',
                            }}
                        >
                            {/* Card body */}
                            <div
                                className={cn(
                                    "select-none relative transition-all",
                                    "h-full w-full backdrop-blur-[18px] backdrop-saturate-[177%] pt-[2em] pb-[1.5em] px-[2em]",
                                    'card-background-light transition-colors  inset-0 rounded-[inherit]',
                                    // absolute
                                )}

                                style={{
                                    overflow: 'visible',
                                    zIndex: -1,
                                    background: `linear-gradient(150deg, rgba(255,255,255,0.5), rgba(255,255,255,0.95) 80%)`,
                                    // boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.15)',
                                    borderRadius: `${backgroundStyles.borderRadius}px`,
                                }}
                            >
                                {card}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};


const BackgroundLayers = ({ backgroundStyles, cardStyles }) => (
    <>
        <div
            className="absolute inset-0"
            style={{
                ..._.omit(backgroundStyles, 'borderRadius'),
                backgroundRepeat: "no-repeat",
            }}
        />
        {backgroundStyles?.backgroundImage && (
            <div
                className="absolute inset-0"
                style={{
                    backgroundRepeat: backgroundStyles.backgroundRepeat,
                    backgroundImage: `url(${backgroundStyles.backgroundImage})`,
                    filter: `blur(${backgroundStyles.backgroundBlur}px)`,
                    opacity: backgroundStyles.backgroundOpacity,
                }}
            />
        )}
        {cardStyles.hasNoiseTexture && (
            <div
                className="absolute inset-0 mix-blend-overlay"
                style={{
                    backgroundImage: `url(/noise1.png)`, // Assuming noise1 is now a public asset
                    backgroundRepeat: "repeat",
                    opacity: cardStyles.noiseTextureOpacity,
                    backgroundPosition: cardStyles.texturePosition,
                    zIndex: 10,
                    borderRadius: `${cardStyles.borderRadius}px`,
                }}
            />
        )}
    </>
);

const CardHeader: React.FC<{
    xConfig: XConfig,
    controls: CardStore['cardStyles']['controls'],
}> = ({ xConfig, controls }) => {

    return (
        <div className='flex w-full'>
            {controls.showUser ? (<div className="flex  flex-grow items-center pb-3">
                <img
                    src={xConfig?.avatar || ''}
                    className="inline object-cover rounded-full transition-all duration-150"
                    alt="Profile image"
                    style={{
                        width: "3em",
                        height: "3em",
                        marginRight: "0.75em"
                    }}
                />
                <div>
                    <div className="flex text-secondary-foreground" style={{ fontWeight: 600, lineHeight: "1.2" }}>
                        <div className="whitespace-nowrap" style={{ paddingRight: "0.375em", fontSize: 18 }}>
                            {xConfig.username}
                        </div>
                    </div>
                    <div className="whitespace-nowrap text-secondary" style={{ fontSize: "1em", fontWeight: 400, lineHeight: "1.2" }} />
                </div>
            </div>) : <div className='flex w-full pb-3'></div>}
            {
                controls.showLogo ? <CardLogo xConfig={xConfig} /> : <></>
            }
        </div>
    );
}

const CardLogo = ({ xConfig }) => {
    return (<div className='flex justify-center'>
        <img
            id="x-logo"
            src={XLogo.src}
            alt=""
            className=" h-[20px] w-[20px] right-4 top-4 opacity-30 dark:invert saturate-0 cursor-alias active:scale-90 transition-all ease-in-out"
        />
    </div>
    )
}

const Watermark = () => {

}

const CardBody: React.FC<{
    xConfig: XConfig,
    cardStyles: CardStore['cardStyles'],
}> = ({ xConfig, cardStyles }) => {
    //  cardStyles.imageLayout ||
    const layout = xConfig.images.length >= 2 ? 'grid4' : 'vertical';

    const images = _.compact(
        [
            ...xConfig.images,
            xConfig?.video?.poster,
            ...(xConfig?.links?.map((link) => link.src) || []),
        ]
    )

    return (
        <div className="flex-grow flex flex-col justify-center">
            <div className={cn("tweet-content text-lg leading-normal pointer-events-none mb-[1em]    ")} style={{ fontSize: cardStyles.fontSize, overflowWrap: 'anywhere' }}>
                <div className="content whitespace-pre-wrap" dir="auto">
                    {xConfig.text}
                </div>
            </div>
            {images && images.length > 0 && (
                <ImageLayout
                    images={images}
                    layout={layout}
                />
            )}
        </div>
    )
}

const CardFooter = ({ xConfig }) => {
    const time = _.isArray(xConfig) ? _.last(xConfig).time : xConfig.time;
    return (
        <div>
            <div className="text-secondary-foreground flex items-center " style={{ paddingBottom: "0.5em", paddingTop: '0.5rem' }}>
                <span>{formatTimestamp(time)}</span>

            </div>
            <div className='flex  items-center justify-between'>
                <div className="flex">
                    {['replies', 'shares', 'likes'].map((stat) => (
                        <div key={stat} className="whitespace-nowrap text-secondary-foreground" style={{ marginRight: "1em" }}>
                            <span className="font-medium" style={{ color: "var(--textPrimary)" }}>
                                {xConfig[stat]}
                            </span>{" "}
                            {stat}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}