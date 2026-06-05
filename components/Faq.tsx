"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { FAQS } from "@/lib/site-data";

export default function Faq() {
  const [open, setOpen] = useState(0);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const apply = () => {
    answerRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.maxHeight = i === open ? `${el.scrollHeight}px` : "0px";
    });
  };

  useLayoutEffect(() => {
    apply();
    const onResize = () => apply();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="faq-list reveal d1" id="faqList">
      {FAQS.map((item, i) => {
        const isOpen = i === open;
        return (
          <div className={`faq-item${isOpen ? " open" : ""}`} key={item.q}>
            <button
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              {item.q}
              <span className="pm" aria-hidden="true">
                +
              </span>
            </button>
            <div
              className="faq-a"
              ref={(el) => {
                answerRefs.current[i] = el;
              }}
            >
              <div className="faq-a-inner">{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
