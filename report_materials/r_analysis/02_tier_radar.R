## 02_tier_radar.R
## Radar chart + grouped bar chart: model performance across 4 tiers.
## Exports plotly HTML and PNG bar chart.

pkgs <- c("dplyr", "ggplot2", "plotly", "htmlwidgets", "tidyr", "scales", "tibble")
for (pkg in pkgs) {
  if (!requireNamespace(pkg, quietly = TRUE))
    install.packages(pkg, repos = "https://cloud.r-project.org")
}
library(dplyr)
library(ggplot2)
library(plotly)
library(htmlwidgets)
library(tidyr)
library(scales)
library(tibble)

# ── Palette & theme ───────────────────────────────────────────────────────────
PALETTE <- c(
  claude   = "#00CED1",
  chatgpt  = "#7FFFD4",
  mistral  = "#A78BFA",
  deepseek = "#4A90D9",
  gemini   = "#FF6B6B"
)
DARK_BG    <- "#0A0F1E"
DARK_PANEL <- "#12193A"
TEXT_CLR   <- "#E8F4F8"
ACCENT     <- "#00FFE0"

dark_theme <- theme_minimal(base_size = 12) +
  theme(
    plot.background   = element_rect(fill = DARK_BG,    color = NA),
    panel.background  = element_rect(fill = DARK_PANEL, color = NA),
    panel.grid.major  = element_line(color = "#1E2A50"),
    panel.grid.minor  = element_blank(),
    axis.text         = element_text(color = TEXT_CLR),
    axis.title        = element_text(color = TEXT_CLR),
    plot.title        = element_text(color = ACCENT, size = 15, face = "bold", hjust = 0.5),
    plot.subtitle     = element_text(color = TEXT_CLR, size = 10, hjust = 0.5),
    legend.background = element_rect(fill = DARK_BG, color = NA),
    legend.text       = element_text(color = TEXT_CLR),
    legend.title      = element_text(color = TEXT_CLR),
    strip.text        = element_text(color = ACCENT),
    plot.caption      = element_text(color = TEXT_CLR, size = 8)
  )

# ── Load data ─────────────────────────────────────────────────────────────────
RDS_PATH <- "data/benchmark_clean.rds"
if (!file.exists(RDS_PATH)) { source("00_load_data.R") }
df <- readRDS(RDS_PATH)

df_complete <- df %>%
  filter(!is.na(model_family)) %>%
  mutate(tier_label = paste0("Tier ", tier))

# ── Compute tier aggregates ───────────────────────────────────────────────────
tier_agg <- df_complete %>%
  group_by(model_family, tier, tier_label) %>%
  summarise(
    avg_score = mean(final_score, na.rm = TRUE),
    se_score  = sd(final_score, na.rm = TRUE) / sqrt(n()),
    n_tasks   = n(),
    .groups   = "drop"
  ) %>%
  mutate(
    ci_lo = avg_score - 1.96 * se_score,
    ci_hi = avg_score + 1.96 * se_score,
    ci_lo = pmax(ci_lo, 0),
    ci_hi = pmin(ci_hi, 1)
  )

# ── Radar chart (plotly) ──────────────────────────────────────────────────────
radar_data <- tier_agg %>%
  select(model_family, tier_label, avg_score) %>%
  pivot_wider(names_from = tier_label, values_from = avg_score)

tier_labels <- c("Tier 1", "Tier 2", "Tier 3", "Tier 4")
# Close the polygon by repeating first column
radar_data_closed <- radar_data
radar_data_closed[["Tier 1_close"]] <- radar_data[["Tier 1"]]

fig_radar <- plot_ly(type = "scatterpolar", mode = "lines+markers")

for (mdl in unique(tier_agg$model_family)) {
  row_data <- tier_agg %>% filter(model_family == mdl) %>% arrange(tier)
  scores   <- c(row_data$avg_score, row_data$avg_score[1])  # close polygon
  labels   <- c(row_data$tier_label, row_data$tier_label[1])

  fig_radar <- fig_radar %>%
    add_trace(
      r     = scores,
      theta = labels,
      name  = mdl,
      line  = list(color = PALETTE[mdl], width = 2.5),
      marker = list(color = PALETTE[mdl], size = 8),
      fill  = "toself",
      fillcolor = paste0(substr(PALETTE[mdl], 1, 7), "33")  # 20% alpha
    )
}

fig_radar <- fig_radar %>%
  layout(
    title  = list(
      text = "Model Performance Across Tiers (Radar)",
      font = list(color = ACCENT, size = 17)
    ),
    polar  = list(
      bgcolor = DARK_PANEL,
      radialaxis = list(
        visible = TRUE, range = c(0, 1),
        color   = TEXT_CLR, gridcolor = "#1E2A50",
        tickfont = list(color = TEXT_CLR),
        tickvals = seq(0, 1, 0.2)
      ),
      angularaxis = list(
        color   = TEXT_CLR,
        tickfont = list(color = TEXT_CLR, size = 13)
      )
    ),
    paper_bgcolor = DARK_BG,
    legend = list(font = list(color = TEXT_CLR)),
    font   = list(color = TEXT_CLR)
  )

if (!dir.exists("figures")) dir.create("figures", recursive = TRUE)

html_path <- "figures/02_tier_radar.html"
htmlwidgets::saveWidget(fig_radar, file = html_path, selfcontained = FALSE)
message("Saved: ", html_path)

# ── Grouped bar chart with 95% CI error bars ──────────────────────────────────
tier_agg_plot <- tier_agg %>%
  mutate(
    model_family = factor(model_family, levels = c("claude", "chatgpt", "mistral", "deepseek"))
  )

p_bar <- ggplot(
  tier_agg_plot,
  aes(x = tier_label, y = avg_score, fill = model_family, group = model_family)
) +
  geom_col(position = position_dodge(width = 0.75), width = 0.65, alpha = 0.92) +
  geom_errorbar(
    aes(ymin = ci_lo, ymax = ci_hi),
    position = position_dodge(width = 0.75),
    width = 0.25, color = "white", linewidth = 0.5
  ) +
  scale_fill_manual(values = PALETTE, name = "Model") +
  scale_y_continuous(limits = c(0, 1), labels = scales::percent_format(accuracy = 1),
                     breaks = seq(0, 1, 0.2)) +
  geom_hline(yintercept = 0.5, linetype = "dashed", color = ACCENT, linewidth = 0.6, alpha = 0.7) +
  annotate("text", x = 0.55, y = 0.52, label = "Pass threshold", color = ACCENT,
           size = 3, hjust = 0) +
  labs(
    title    = "Model Performance by Tier (95% CI)",
    subtitle = "Error bars = 1.96 × SE across tasks within each tier",
    x        = "Tier",
    y        = "Average Score",
    caption  = "n = 4 complete models. Gemini excluded (incomplete)."
  ) +
  dark_theme +
  theme(
    axis.text.x = element_text(size = 11, color = TEXT_CLR),
    legend.position = "right"
  )

png_path <- "figures/02_tier_radar_bar.png"
ggsave(png_path, p_bar, width = 1800, height = 1000, units = "px", dpi = 150)
message("Saved: ", png_path)
message("02_tier_radar.R complete.\n")
