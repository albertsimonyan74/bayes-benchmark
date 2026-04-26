## 03_distributions.R
## ggridges score distributions per model + plotly interactive version.
## Exports PNG and HTML.

pkgs <- c("dplyr", "ggplot2", "ggridges", "plotly", "htmlwidgets", "scales", "tidyr")
for (pkg in pkgs) {
  if (!requireNamespace(pkg, quietly = TRUE))
    install.packages(pkg, repos = "https://cloud.r-project.org")
}
library(dplyr)
library(ggplot2)
library(ggridges)
library(plotly)
library(htmlwidgets)
library(scales)
library(tidyr)

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

dark_theme <- theme_minimal(base_size = 13) +
  theme(
    plot.background   = element_rect(fill = DARK_BG,    color = NA),
    panel.background  = element_rect(fill = DARK_PANEL, color = NA),
    panel.grid.major  = element_line(color = "#1E2A50"),
    panel.grid.minor  = element_blank(),
    axis.text         = element_text(color = TEXT_CLR),
    axis.title        = element_text(color = TEXT_CLR),
    plot.title        = element_text(color = ACCENT, size = 16, face = "bold", hjust = 0.5),
    plot.subtitle     = element_text(color = TEXT_CLR, size = 10, hjust = 0.5),
    legend.background = element_rect(fill = DARK_BG, color = NA),
    legend.text       = element_text(color = TEXT_CLR),
    legend.title      = element_text(color = TEXT_CLR),
    plot.caption      = element_text(color = TEXT_CLR, size = 8)
  )

# ── Load data ─────────────────────────────────────────────────────────────────
RDS_PATH <- "data/benchmark_clean.rds"
if (!file.exists(RDS_PATH)) { source("00_load_data.R") }
df <- readRDS(RDS_PATH)

df_complete <- df %>%
  filter(!is.na(model_family)) %>%
  mutate(
    model_family = factor(model_family,
                          levels = rev(c("claude", "chatgpt", "mistral", "deepseek")))
  )

# Median per model for annotation
medians <- df_complete %>%
  group_by(model_family) %>%
  summarise(med = median(final_score, na.rm = TRUE), .groups = "drop")

# ── ggridges plot ─────────────────────────────────────────────────────────────
p_ridges <- ggplot(df_complete, aes(x = final_score, y = model_family, fill = model_family)) +
  geom_density_ridges(
    alpha = 0.70, scale = 1.3,
    quantile_lines = TRUE, quantiles = 2,   # median line
    color = "white", linewidth = 0.4,
    jittered_points = TRUE,
    point_shape = "|", point_size = 1.5,
    point_alpha = 0.4, point_color = "white",
    position = position_points_jitter(width = 0.05, height = 0)
  ) +
  geom_vline(xintercept = 0.5, linetype = "dashed", color = ACCENT,
             linewidth = 0.8, alpha = 0.85) +
  geom_vline(xintercept = 1.0, linetype = "dotted", color = "white",
             linewidth = 0.6, alpha = 0.5) +
  annotate("text", x = 0.515, y = 0.6, label = "Pass (0.5)",
           color = ACCENT, size = 3.2, hjust = 0, fontface = "italic") +
  # Median labels
  geom_label(
    data = medians,
    aes(x = med, y = model_family, label = sprintf("median=%.3f", med)),
    fill  = DARK_BG, color = TEXT_CLR, size = 3,
    hjust = -0.08, vjust = -0.8, label.size = 0.2
  ) +
  scale_fill_manual(values = PALETTE, guide = "none") +
  scale_x_continuous(limits = c(-0.02, 1.05), breaks = seq(0, 1, 0.25),
                     labels = number_format(accuracy = 0.01)) +
  labs(
    title    = "Score Distributions by Model",
    subtitle = "Density ridges with individual task scores  |  Dashed line = pass threshold",
    x        = "Final Score",
    y        = NULL,
    caption  = "n = 136 tasks per model. Gemini excluded (incomplete — 76/136 tasks ran)."
  ) +
  dark_theme +
  theme(
    axis.text.y     = element_text(size = 12, color = TEXT_CLR, face = "bold"),
    panel.grid.major.y = element_blank()
  )

if (!dir.exists("figures")) dir.create("figures", recursive = TRUE)

png_path <- "figures/03_distributions.png"
ggsave(png_path, p_ridges, width = 1600, height = 1000, units = "px", dpi = 150)
message("Saved: ", png_path)

# ── Interactive plotly violin+strip ──────────────────────────────────────────
models_ord <- c("claude", "chatgpt", "mistral", "deepseek")
df_plotly  <- df %>%
  filter(model_family %in% models_ord) %>%
  mutate(model_family = factor(model_family, levels = models_ord))

fig_plotly <- plot_ly()

for (mdl in models_ord) {
  sub <- df_plotly %>% filter(model_family == mdl)
  fig_plotly <- fig_plotly %>%
    add_trace(
      type = "violin",
      x    = sub$final_score,
      name = mdl,
      box  = list(visible = TRUE),
      meanline = list(visible = TRUE, color = "white"),
      points  = "all",
      jitter  = 0.3,
      pointpos = 0,
      marker  = list(color = PALETTE[mdl], size = 3, opacity = 0.4),
      line    = list(color = PALETTE[mdl]),
      fillcolor = paste0(substr(PALETTE[mdl], 1, 7), "55"),
      orientation = "h",
      side = "both"
    )
}

med_df <- df_plotly %>%
  group_by(model_family) %>%
  summarise(med = median(final_score, na.rm = TRUE), .groups = "drop")

fig_plotly <- fig_plotly %>%
  add_segments(
    x = 0.5, xend = 0.5,
    y = -0.5, yend = length(models_ord) - 0.5,
    line = list(color = ACCENT, dash = "dash", width = 2),
    showlegend = FALSE,
    name = "Pass threshold"
  ) %>%
  layout(
    title  = list(text = "Score Distributions by Model",
                  font = list(color = ACCENT, size = 17)),
    xaxis  = list(title = "Final Score", range = c(-0.05, 1.05),
                  color = TEXT_CLR, tickfont = list(color = TEXT_CLR)),
    yaxis  = list(title = "Model", color = TEXT_CLR,
                  tickfont = list(color = TEXT_CLR)),
    paper_bgcolor = DARK_BG,
    plot_bgcolor  = DARK_PANEL,
    font   = list(color = TEXT_CLR),
    legend = list(font = list(color = TEXT_CLR))
  )

html_path <- "figures/03_distributions.html"
htmlwidgets::saveWidget(fig_plotly, file = html_path, selfcontained = FALSE)
message("Saved: ", html_path)
message("03_distributions.R complete.\n")
