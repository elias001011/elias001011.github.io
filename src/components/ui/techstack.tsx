import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

export type ToolDockItem = {
  /** Shown in the tooltip and read out by screen readers. */
  label: string;
  /** Fills the tile. It is decorative. */
  icon: React.ReactNode;
};

export type ToolDockProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
  items: ToolDockItem[];
  /** Largest tile size in px. The row shrinks to fit a narrower container. */
  size?: number;
  /** How far each tile tucks under the one before it, as a share of its width. Negative leaves a gap. */
  overlap?: number;
  /** How much the tile under the pointer grows: 0.28 is 28%. */
  magnification?: number;
  /** Lean each tile its own way at rest. */
  tilt?: boolean;
  /** Seconds to wait before the tiles deal themselves in. */
  delay?: number;
  /** Accessible name for the list. */
  label?: string;
};

/** Fixed per position, so the row leans the same way on every render. */
const TILT = [-7, 5, -4, 8, -6, 4, -8, 6, -3, 7, -5, 6];
/** How many tile widths either side of the pointer still swell. */
const REACH = 1.2;
/** How far a fully swollen tile rises, in tile heights. */
const LIFT = 0.19;
/** Quick to settle, with no wobble. */
const SPRING = { stiffness: 520, damping: 40, mass: 0.5 };

/** Each slot's resting centre along the row, measured without transforms. */
type Layout = { centers: number[]; width: number };

/** How swollen tile `k` is with the pointer at `x`, from 0 to 1. */
function swellAt({ centers, width }: Layout, k: number, x: number) {
  const center = centers[k];
  if (!Number.isFinite(x) || center === undefined || !width) return 0;
  return Math.max(0, 1 - Math.abs(x - center) / width / REACH) ** 2;
}

const deal: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.94, filter: "blur(3px)" },
  shown: ({ index, still, delay }: { index: number; still: boolean; delay: number }) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: still ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: delay + index * 0.04 },
    transitionEnd: { filter: "none" },
  }),
};

type DockTileProps = {
  item: ToolDockItem;
  index: number;
  count: number;
  pointer: MotionValue<number>;
  layout: React.RefObject<Layout>;
  still: boolean;
  overlap: number;
  magnification: number;
  tilt: boolean;
  delay: number;
  onFocus: (index: number) => void;
  onBlur: () => void;
};

/**
 * One tile. Everything it does is worked out from the pointer's position along
 * the row against the tile's resting centre, never from what is under the
 * pointer, so the hovered tile cannot change as tiles grow (no flicker).
 */
const DockTile = React.memo(function DockTile({
  item,
  index,
  count,
  pointer,
  layout,
  still,
  overlap,
  magnification,
  tilt,
  delay,
  onFocus,
  onBlur,
}: DockTileProps) {
  const lean = tilt ? TILT[index % TILT.length] : 0;
  const room = Math.max(0, overlap + magnification / 2);

  const near = useTransform(pointer, (x) => (still ? 0 : swellAt(layout.current, index, x)));
  const push = useTransform(pointer, (x) => {
    if (still) return 0;
    const { centers, width } = layout.current;
    let shift = 0;
    for (let k = 0; k < centers.length; k++) {
      if (k !== index) shift += swellAt(layout.current, k, x) * (k < index ? 1 : -1);
    }
    return shift * width * room;
  });

  const swell = useSpring(near, SPRING);
  const x = useSpring(push, SPRING);
  const scale = useTransform(swell, (v) => 1 + v * magnification);
  const y = useTransform(swell, (v) => -v * LIFT * layout.current.width);
  const rotate = useTransform(swell, (v) => lean * (1 - v));

  return (
    <motion.li
      data-slot="tool-dock-item"
      custom={{ index, still, delay }}
      variants={deal}
      className="tool-dock-item"
      style={{
        zIndex: count - index,
        marginLeft: index === 0 ? 0 : `calc(var(--tool-dock-size) * ${-overlap})`,
      }}
    >
      <motion.div
        role="img"
        aria-label={item.label}
        tabIndex={0}
        onFocus={() => onFocus(index)}
        onBlur={onBlur}
        style={{ x, y, scale, rotate }}
        className="tool-dock-slot"
      >
        {item.icon}
      </motion.div>
    </motion.li>
  );
});

/** A row of tiles that swells around the pointer, with one label that glides to whichever tile is nearest. */
export function ToolDock({
  items,
  size = 56,
  overlap = 0.12,
  magnification = 0.28,
  tilt = true,
  delay = 0,
  label = "Tools",
  className,
  ...props
}: ToolDockProps) {
  const rail = React.useRef<HTMLUListElement>(null);
  const layout = React.useRef<Layout>({ centers: [], width: 0 });
  const still = useReducedMotion() ?? false;
  // The pointer's position along the row in px, Infinity when elsewhere.
  const pointer = useMotionValue(Number.POSITIVE_INFINITY);
  const [active, setActive] = React.useState<number | null>(null);
  const current = React.useRef<number | null>(null);
  const [glide, setGlide] = React.useState(false);
  const [at, setAt] = React.useState(0);
  const [text, setText] = React.useState(items[0]?.label ?? "");

  React.useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const measure = () => {
      const slots = [...el.children] as HTMLElement[];
      layout.current = {
        centers: slots.map((li) => li.offsetLeft + li.offsetWidth / 2),
        width: slots[0]?.offsetWidth ?? 0,
      };
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length]);

  const select = (nearest: number) => {
    if (nearest === current.current) return;
    setGlide(current.current !== null);
    current.current = nearest;
    setActive(nearest);
    setText(items[nearest].label);
    setAt(layout.current.centers[nearest] ?? 0);
  };

  const track = (clientX: number) => {
    const el = rail.current;
    if (!el) return;
    const x = clientX - el.getBoundingClientRect().left;
    pointer.set(x);
    const { centers } = layout.current;
    if (centers.length === 0) return;
    let nearest = 0;
    for (let i = 1; i < centers.length; i++) {
      if (Math.abs(x - centers[i]) < Math.abs(x - centers[nearest])) nearest = i;
    }
    select(nearest);
  };

  const release = React.useCallback(() => {
    pointer.set(Number.POSITIVE_INFINITY);
    current.current = null;
    setActive(null);
  }, [pointer]);

  // Keyboard: focusing a tile is the same as resting the pointer on its centre.
  const focus = React.useCallback(
    (index: number) => {
      const center = layout.current.centers[index];
      if (center === undefined) return;
      pointer.set(center);
      setGlide(current.current !== null);
      current.current = index;
      setActive(index);
      setText(items[index].label);
      setAt(center);
    },
    [items, pointer],
  );

  const span = 1 + (items.length - 1) * (1 - overlap) + 2 * Math.max(0, overlap + magnification / 2);
  const rise = LIFT + magnification;

  return (
    <div data-slot="tool-dock" className={cn("tool-dock", className)} {...props}>
      <div
        className="tool-dock-inner"
        style={
          {
            "--tool-dock-size": `min(${size}px, calc((100cqw - 1rem) / ${span}))`,
            "--tool-dock-rise": rise,
          } as React.CSSProperties
        }
      >
        <span
          aria-hidden
          data-slot="tool-dock-tooltip"
          data-state={active === null ? "closed" : "open"}
          className={cn("tool-dock-tooltip", glide && "is-gliding")}
          style={{ translate: `calc(${at}px - 50%) 0` }}
        >
          {text}
          <span className="tool-dock-tooltip-tip" />
        </span>

        <motion.ul
          ref={rail}
          role="list"
          aria-label={label}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.2 }}
          onPointerMove={(event) => track(event.clientX)}
          onPointerDown={(event) => track(event.clientX)}
          onPointerLeave={release}
          onPointerUp={(event) => {
            if (event.pointerType !== "mouse") release();
          }}
          onPointerCancel={release}
          className="tool-dock-rail"
        >
          {items.map((item, index) => (
            <DockTile
              key={item.label}
              item={item}
              index={index}
              count={items.length}
              pointer={pointer}
              layout={layout}
              still={still}
              overlap={overlap}
              magnification={magnification}
              tilt={tilt}
              delay={delay}
              onFocus={focus}
              onBlur={release}
            />
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

/** An app-icon tile for a logo: a rounded square with a hairline edge. */
export function ToolDockTile({ className, children, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div data-slot="tool-dock-tile" className={cn("tool-dock-tile", className)} {...props}>
      {children}
    </div>
  );
}
