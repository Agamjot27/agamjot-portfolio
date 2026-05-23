"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./BounceCards.module.css";

interface BounceCardsProps {
  className?: string;
  images?: string[];
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
  onCardClick?: (src: string, index: number) => void;
}

const defaultTransformStyles = [
  "rotate(10deg) translate(-170px)",
  "rotate(5deg) translate(-85px)",
  "rotate(-3deg)",
  "rotate(-10deg) translate(85px)",
  "rotate(2deg) translate(170px)",
];

export default function BounceCards({
  className = "",
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = "elastic.out(1, 0.8)",
  transformStyles = defaultTransformStyles,
  enableHover = true,
  onCardClick,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-bounce-card]",
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [animationDelay, animationStagger, easeType]);

  const getNoRotationTransform = (transformStr: string) => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);

    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
    }

    return transformStr === "none" ? "rotate(0deg)" : `${transformStr} rotate(0deg)`;
  };

  const getPushedTransform = (baseTransform: string, offsetX: number) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);

    if (match) {
      const currentX = parseFloat(match[1]);
      return baseTransform.replace(translateRegex, `translate(${currentX + offsetX}px)`);
    }

    return baseTransform === "none" ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
  };

  const getCard = (index: number) => containerRef.current?.querySelector<HTMLElement>(`[data-bounce-card="${index}"]`);

  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover || !containerRef.current) return;

    images.forEach((_, index) => {
      const target = getCard(index);
      if (!target) return;

      gsap.killTweensOf(target);
      const baseTransform = transformStyles[index] || "none";

      if (index === hoveredIdx) {
        gsap.to(target, {
          transform: getNoRotationTransform(baseTransform),
          duration: 0.4,
          ease: "back.out(1.4)",
          overwrite: "auto",
        });
        return;
      }

      const offsetX = index < hoveredIdx ? -160 : 160;
      const distance = Math.abs(hoveredIdx - index);

      gsap.to(target, {
        transform: getPushedTransform(baseTransform, offsetX),
        duration: 0.4,
        ease: "back.out(1.4)",
        delay: distance * 0.05,
        overwrite: "auto",
      });
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;

    images.forEach((_, index) => {
      const target = getCard(index);
      if (!target) return;

      gsap.killTweensOf(target);
      gsap.to(target, {
        transform: transformStyles[index] || "none",
        duration: 0.4,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  return (
    <div
      className={[styles.bounceCardsContainer, className].filter(Boolean).join(" ")}
      ref={containerRef}
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      {images.map((src, index) => (
        <button
          type="button"
          key={`${src}-${index}`}
          data-bounce-card={index}
          className={styles.card}
          style={{
            transform: transformStyles[index] ?? "none",
          }}
          onMouseEnter={() => pushSiblings(index)}
          onMouseLeave={resetSiblings}
          onFocus={() => pushSiblings(index)}
          onBlur={resetSiblings}
          onClick={() => onCardClick?.(src, index)}
          aria-label={`Project visual ${index + 1}`}
        >
          <img className={styles.image} src={src} alt="" />
        </button>
      ))}
    </div>
  );
}
