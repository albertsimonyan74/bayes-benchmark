## 14_difficulty.R
## Difficulty progression: all 5 models, clean colors, informative labels.
## X: difficulty (basic / intermediate / advanced)
## Outputs: figures/14_difficulty.png (2400×1400)
##          interactive/14_difficulty.html

pkgs <- c("dplyr", "ggplot2", "plotly", "htmlwidgets", "scales")
for (pkg in pkgs) {
  if (!requireNamespace(pkg, quietly = TRUE))
    install.packages(pkg, repos = "https://cloud.r-project.org")
}
suppressPackageStartupMessages({
  library(dplyr); library(ggplot2); library(plotly)
  library(htmlwidgets); library(scales)
})

PALETTE <- c(
  claude   = "#00CED1",
  chatgpt  = "#7FFFD4",
  mistral  = "#A78BFA",
  deepseek = "#4A90D9",
  gemini   = "#FF6B6B"
)
MODEL_LABELS <- c(claude="Claude", chatgpt="ChatGPT", mistral="Mistral",
                  deepseek="DeepSeek", gemini="Gemini")
DARK_BG    <- "#0A0F1E"
DARK_PANEL <- "#0D1426"
TEXT_CLR   <- "#E8F4F8"
ACCENT     <- "#00FFE0"

if (!file.exists("data/benchmark_clean.rds")) stop("Run 00_load_data.R first.")
df <- readRDS("data/benchmark_clean.rds")

COMPLETE <- c("claude", "chatgpt", "deepseek", "gemini", "mistral")
DIFF_ORD  <- c("basic", "intermediate", "advanced")

df_c <- df %>%
  filter(model_family %in% COMPLETE) %>%
  mutate(
    model_family = factor(model_family, levels = COMPLETE),
    difficulty   = factor(difficulty,   levels = DIFF_ORD)
  )

diff_sum <- df_c %>%
  group_by(model_family, difficulty) %>%
  summarise(
    mean_score = mean(final_score, na.rm = TRUE),
    se         = sd(final_score, na.rm = TRUE) / sqrt(n()),
    n_tasks    = n(),
    .groups    = "drop"
  ) %>%
  mutate(
    diff_num    = as.integer(difficulty),
    model_label = MODEL_LABELS[as.character(model_family)]
  )

# Right-side label data (advanced = diff_num 3)
right_labels <- diff_sum %>%
  filter(difficulty == "advanced") %>%
  arrange(desc(mean_score))

p <- ggplot(diff_sum, aes(x = diff_num, y = mean_score,
                           color = model_family, group = model_family)) +
  # Background bands per difficulty zone
  annotate("rect", xmin = 0.5, xmax = 1.5, ymin = 0, ymax = 1.05,
           fill = "#00FFE0", alpha = 0.03) +
  annotate("rect", xmin = 1.5, xmax = 2.5, ymin = 0, ymax = 1.05,
           fill = "#FFD700", alpha = 0.03) +
  annotate("rect", xmin = 2.5, xmax = 3.5, ymin = 0, ymax = 1.05,
           fill = "#FF4757", alpha = 0.03) +
  # Zone labels at top
  annotate("text", x = 1, y = 1.02, label = "BASIC", color = "#00FFE066",
           size = 2.8, fontface = "bold") +
  annotate("text", x = 2, y = 1.02, label = "INTERMEDIATE", color = "#FFD70066",
           size = 2.8, fontface = "bold") +
  annotate("text", x = 3, y = 1.02, label = "ADVANCED", color = "#FF475766",
           size = 2.8, fontface = "bold") +
  # Pass threshold
  geom_hline(yintercept = 0.5, linetype = "dashed",
             color = ACCENT, linewidth = 0.65, alpha = 0.7) +
  annotate("text", x = 0.55, y = 0.515, label = "Pass threshold (50%)",
           color = ACCENT, size = 2.8, hjust = 0, fontface = "italic") +
  # SE ribbon
  geom_ribbon(aes(ymin = mean_score - se, ymax = mean_score + se,
                  fill = model_family),
              alpha = 0.10, color = NA, show.legend = FALSE) +
  # Lines
  geom_line(linewidth = 1.5, alpha = 0.95) +
  # Points
  geom_point(size = 5, shape = 21, aes(fill = model_family),
             color = "white", stroke = 0.7, show.legend = FALSE) +
  # Score labels
  geom_text(aes(label = sprintf("%.0f%%", mean_score * 100)),
            vjust = -1.15, size = 3, fontface = "bold") +
  # Right-side model labels
  geom_text(
    data = right_labels,
    aes(label = model_label, x = 3.08),
    hjust = 0, size = 3.3, fontface = "bold"
  ) +
  scale_color_manual(values = PALETTE, guide = "none") +
  scale_fill_manual (values = PALETTE, guide = "none") +
  scale_x_continuous(
    breaks = 1:3,
    labels = c("Basic", "Intermediate", "Advanced"),
    limits = c(0.45, 3.7)
  ) +
  scale_y_continuous(limits = c(0, 1.07),
                     labels = percent_format(accuracy = 1),
                     breaks = seq(0, 1, 0.2)) +
  labs(
    title    = "Score by Difficulty Level — All 5 Models",
    subtitle = "Ribbon = ±1 SE  ·  Dashed = 50% pass threshold  ·  n = 171 tasks",
    x = "Difficulty", y = "Average Score"
  ) +
  theme_minimal(base_size = 13) +
  theme(
    plot.background   = element_rect(fill = DARK_BG,    color = NA),
    panel.background  = element_rect(fill = DARK_PANEL, color = NA),
    panel.grid.major  = element_line(color = "#1E2A50", linewidth = 0.3),
    panel.grid.minor  = element_blank(),
    axis.text         = element_text(color = TEXT_CLR, size = 11),
    axis.title        = element_text(color = TEXT_CLR, size = 11),
    plot.title        = element_text(color = ACCENT, face = "bold", size = 15, hjust = 0.5),
    plot.subtitle     = element_text(color = "#8BAFC0", size = 9, hjust = 0.5),
    plot.margin       = margin(16, 48, 16, 16)
  )

dir.create("figures",     showWarnings = FALSE)
dir.create("interactive", showWarnings = FALSE)

ggsave("figures/14_difficulty.png", plot = p,
       width = 2400, height = 1400, units = "px", dpi = 200, bg = DARK_BG)
message("Saved: figures/14_difficulty.png")

# ── Interactive plotly ────────────────────────────────────────
fig_ly <- plot_ly()

for (mdl in COMPLETE) {
  d <- diff_sum %>% filter(model_family == mdl) %>% arrange(diff_num)
  fig_ly <- fig_ly %>% add_trace(
    x    = as.character(d$difficulty),
    y    = d$mean_score,
    type = "scatter", mode = "lines+markers",
    name = MODEL_LABELS[mdl],
    line   = list(color = PALETTE[mdl], width = 3),
    marker = list(color = PALETTE[mdl], size = 12,
                  line = list(color = "white", width = 2)),
    error_y = list(type = "data", array = d$se * 1.96,
                   color = PALETTE[mdl], thickness = 1.5, width = 6),
    text      = paste0(MODEL_LABELS[mdl], "<br>", d$difficulty,
                       "<br>Score: ", round(d$mean_score * 100, 1), "%<br>n = ", d$n_tasks),
    hoverinfo = "text"
  )
}

fig_ly <- fig_ly %>%
  layout(
    title  = list(text = "Score by Difficulty Level — All 5 Models",
                  font = list(color = ACCENT, size = 16)),
    xaxis  = list(title = "Difficulty", color = TEXT_CLR,
                  categoryorder = "array",
                  categoryarray = c("basic", "intermediate", "advanced"),
                  tickfont = list(size = 12)),
    yaxis  = list(title = "Average Score", tickformat = ".0%",
                  color = TEXT_CLR, range = c(0, 1.05),
                  gridcolor = "#1E2A50"),
    paper_bgcolor = DARK_BG,
    plot_bgcolor  = DARK_PANEL,
    font   = list(color = TEXT_CLR),
    legend = list(font = list(color = TEXT_CLR)),
    shapes = list(list(
      type = "line", x0 = 0, x1 = 1, xref = "paper",
      y0 = 0.5, y1 = 0.5,
      line = list(color = ACCENT, dash = "dash", width = 1.5)
    ))
  )

htmlwidgets::saveWidget(fig_ly, "interactive/14_difficulty.html", selfcontained = FALSE)
message("Saved: interactive/14_difficulty.html")
message("14_difficulty.R complete.\n")
