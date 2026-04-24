## 07_latency_accuracy.R
## Scatter: avg latency × avg score per model.
## Point size = pass count. 4 quadrant annotations. Error bars ±SE.
## Exports PNG and HTML.

pkgs <- c("dplyr", "ggplot2", "ggrepel", "plotly", "htmlwidgets", "scales", "tibble", "stringr")
for (pkg in pkgs) {
  if (!requireNamespace(pkg, quietly = TRUE))
    install.packages(pkg, repos = "https://cloud.r-project.org")
}
library(dplyr)
library(ggplot2)
library(ggrepel)
library(plotly)
library(htmlwidgets)
library(scales)
library(tibble)
library(stringr)

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

df_complete <- df %>% filter(model_family != "gemini")

# ── Aggregate per model ───────────────────────────────────────────────────────
model_agg <- df_complete %>%
  group_by(model_family) %>%
  summarise(
    n_tasks      = n(),
    avg_score    = mean(final_score, na.rm = TRUE),
    se_score     = sd(final_score, na.rm = TRUE) / sqrt(n()),
    avg_latency  = mean(latency_ms, na.rm = TRUE),
    se_latency   = sd(latency_ms, na.rm = TRUE) / sqrt(n()),
    pass_count   = sum(pass, na.rm = TRUE),
    pass_rate    = mean(pass, na.rm = TRUE),
    .groups      = "drop"
  ) %>%
  mutate(
    score_lo = avg_score - 1.96 * se_score,
    score_hi = avg_score + 1.96 * se_score,
    lat_lo   = avg_latency - 1.96 * se_latency,
    lat_hi   = avg_latency + 1.96 * se_latency,
    color    = PALETTE[model_family],
    label    = stringr::str_to_title(model_family)
  )

# ── Quadrant boundaries ───────────────────────────────────────────────────────
mid_lat   <- mean(model_agg$avg_latency)
mid_score <- mean(model_agg$avg_score)

# Quadrant labels
quad_labels <- tibble::tibble(
  x     = c(mid_lat * 0.68, mid_lat * 1.35, mid_lat * 0.68, mid_lat * 1.35),
  y     = c(mid_score * 1.12, mid_score * 1.12, mid_score * 0.88, mid_score * 0.88),
  label = c("Fast &\nAccurate", "Slow &\nAccurate", "Fast &\nInaccurate", "Slow &\nInaccurate"),
  color = c("#00FFE0", "#7FFFD4", "#A78BFA", "#FF6B6B")
)

# ── ggplot2 ───────────────────────────────────────────────────────────────────
p_lat <- ggplot(model_agg,
                aes(x = avg_latency, y = avg_score,
                    size = pass_count, color = model_family,
                    label = label)) +
  # Quadrant guide lines
  geom_vline(xintercept = mid_lat, linetype = "dotted",
             color = "#3A4A70", linewidth = 0.8) +
  geom_hline(yintercept = mid_score, linetype = "dotted",
             color = "#3A4A70", linewidth = 0.8) +
  # Quadrant annotations
  geom_text(data = quad_labels,
            aes(x = x, y = y, label = label, color = color),
            size = 3.2, fontface = "italic", inherit.aes = FALSE, alpha = 0.7) +
  # Error bars — latency
  geom_errorbarh(
    aes(xmin = lat_lo, xmax = lat_hi),
    height = 0.012, linewidth = 0.6, alpha = 0.6
  ) +
  # Error bars — score
  geom_errorbar(
    aes(ymin = score_lo, ymax = score_hi),
    width = 200, linewidth = 0.6, alpha = 0.6
  ) +
  geom_point(alpha = 0.90) +
  ggrepel::geom_label_repel(
    size = 4, fontface = "bold",
    box.padding   = 0.4,
    point.padding = 0.3,
    min.segment.length = 0.2,
    fill  = DARK_BG, label.size = 0.3
  ) +
  scale_color_manual(values = PALETTE, guide = "none") +
  scale_size_continuous(
    name   = "Tasks Passed",
    range  = c(5, 18),
    breaks = c(50, 75, 90, 100, 110, 120)
  ) +
  scale_x_continuous(labels = comma_format(suffix = " ms")) +
  scale_y_continuous(limits = c(0.4, 0.85),
                     labels = number_format(accuracy = 0.01)) +
  labs(
    title    = "Latency vs. Accuracy Trade-off",
    subtitle = "Point size = tasks passed  |  Error bars = ±1.96 × SE",
    x        = "Average Latency (ms)",
    y        = "Average Final Score",
    caption  = "n = 136 tasks per model. Quadrant lines at grand mean latency and score."
  ) +
  dark_theme +
  theme(
    legend.position = c(0.85, 0.25),
    legend.background = element_rect(fill = "#0D1535", color = "#1E2A50")
  )

if (!dir.exists("figures")) dir.create("figures", recursive = TRUE)

png_path <- "figures/07_latency_accuracy.png"
ggsave(png_path, p_lat, width = 1400, height = 1000, units = "px", dpi = 150)
message("Saved: ", png_path)

# ── Interactive plotly ────────────────────────────────────────────────────────
fig_plotly <- plot_ly(model_agg) %>%
  # Quadrant shading via shapes
  add_segments(
    x = ~mid_lat, xend = ~mid_lat,
    y = 0.3, yend = 0.95,
    line = list(color = "#3A4A70", dash = "dot", width = 1.5),
    showlegend = FALSE
  ) %>%
  add_segments(
    x = min(model_agg$avg_latency) * 0.85,
    xend = max(model_agg$avg_latency) * 1.15,
    y = ~mid_score, yend = ~mid_score,
    line = list(color = "#3A4A70", dash = "dot", width = 1.5),
    showlegend = FALSE
  ) %>%
  add_trace(
    x    = ~avg_latency,
    y    = ~avg_score,
    type = "scatter",
    mode = "markers+text",
    text = ~label,
    textposition = "top center",
    textfont = list(color = model_agg$color, size = 13),
    marker = list(
      size    = ~sqrt(pass_count) * 3,
      color   = ~color,
      opacity = 0.85,
      line    = list(color = "white", width = 1.5)
    ),
    error_x = list(
      type       = "data",
      array      = model_agg$se_latency * 1.96,
      color      = model_agg$color,
      thickness  = 1.5, width = 4
    ),
    error_y = list(
      type       = "data",
      array      = model_agg$se_score * 1.96,
      color      = model_agg$color,
      thickness  = 1.5, width = 4
    ),
    hoverinfo = "text",
    hovertext = ~paste0(
      "<b>", label, "</b>",
      "<br>Avg Score: ", round(avg_score, 3),
      "<br>Avg Latency: ", round(avg_latency, 0), " ms",
      "<br>Pass Rate: ", scales::percent(pass_rate, accuracy = 0.1),
      "<br>Tasks Passed: ", pass_count, "/", n_tasks
    ),
    showlegend = FALSE
  ) %>%
  layout(
    title  = list(text = "Latency vs. Accuracy Trade-off",
                  font = list(color = ACCENT, size = 17)),
    xaxis  = list(title = "Average Latency (ms)",
                  color = TEXT_CLR, tickformat = ",.0f"),
    yaxis  = list(title = "Average Final Score",
                  color = TEXT_CLR, range = c(0.38, 0.85)),
    paper_bgcolor = DARK_BG,
    plot_bgcolor  = DARK_PANEL,
    font   = list(color = TEXT_CLR),
    annotations = list(
      list(x = mid_lat * 0.70, y = mid_score + 0.06,
           text = "Fast & Accurate",
           font = list(color = "#00FFE0", size = 11), showarrow = FALSE),
      list(x = mid_lat * 1.30, y = mid_score + 0.06,
           text = "Slow & Accurate",
           font = list(color = "#7FFFD4", size = 11), showarrow = FALSE),
      list(x = mid_lat * 0.70, y = mid_score - 0.06,
           text = "Fast & Inaccurate",
           font = list(color = "#A78BFA", size = 11), showarrow = FALSE),
      list(x = mid_lat * 1.30, y = mid_score - 0.06,
           text = "Slow & Inaccurate",
           font = list(color = "#FF6B6B", size = 11), showarrow = FALSE)
    )
  )

html_path <- "figures/07_latency_accuracy.html"
htmlwidgets::saveWidget(fig_plotly, file = html_path, selfcontained = FALSE)
message("Saved: ", html_path)
message("07_latency_accuracy.R complete.\n")
