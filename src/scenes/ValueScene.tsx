/* 幕 3 · 价值换算 */
import { useI18n } from "@/lib/i18n";
import { SceneHead } from "@/components/SceneBits";

export function ValueScene() {
  const { t } = useI18n();

  return (
    <div className="flex h-full flex-col">
      <SceneHead eyebrow={t("scene.3")} title={t("value.title")} sub={t("value.sub")} />
      <div className="flex min-h-0 flex-1 items-center justify-center px-14 pb-8">
        <div className="max-w-[760px] rounded-3xl bg-paper p-10 text-center shadow-card ring-1 ring-black/[.04]">
          <div className="text-[13px] font-medium uppercase tracking-[.16em] text-gold">{t("value.notice.eyebrow")}</div>
          <p className="mt-4 text-[24px] font-semibold leading-tight text-ink">{t("value.notice.title")}</p>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-faint">{t("value.notice.body")}</p>
        </div>
      </div>
    </div>
  );
}
