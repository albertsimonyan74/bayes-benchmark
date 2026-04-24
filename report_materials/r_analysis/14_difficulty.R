## 14_difficulty.R
## Difficulty progression line chart.
## X axis: difficulty (basic → intermediate → advanced)
## One line per model, with LOESS smooths + shaded tier bands behind.
## Outputs: figures/14_difficulty.png (2400×1600)
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

PALETTE <- c(chatgpt = "#10A37F", deepseek = "#4D9FFF",
             mistral = "#FF7043", claude   = "#CC785C")
TIER_COLORS <- c("1" = "#00FFE0", "2" = "#00BFFF", "3" = "#9B59B6", "4" = "#FF4757")
DARK_BG    <- "#0A0F1E"
DARK_PANEL <- "#0D1426"
TEXT_CLR   <- "#E8F4F8"

if (!file.exists("data/benchmark_clean.rds")) stop("Run 00_load_data.R first.")
df <- readRDS("data/benchmark_clean.rds")

COMPLETE <- c("claude", "chatgpt", "deepseek", "mistral")
DIFF_ORD  <- c("basic", "intermediate", "advanced")

df_c <- df %>%
  filter(model_family %in% COMPLETE) %>%
  mutate(
    model_family = factor(model_family, levels = COMPLETE),
    difficulty   = factor(difficulty,   levels = DIFF_ORD)
  )

# Summary: mean ± se per model × difficulty
diff_sum <- df_c %>%
  group_by(model_family, difficulty) %>%
  summarise(
    mean_score = mean(final_score, na.rm = TRUE),
    se         = sd(final_score, na.rm = TRUE) / sqrt(n()),
    .groups    = "drop"
  ) %>%
  mutate(diff_num = as.integer(difficulty))

# Tier-level mean per difficulty (for ribbon band context)
tier_diff <- df_c %>%
  group_by(tier, difficulty) %>%
  summarise(avg = mean(final_score, na.rm = TRUE), .groups = "drop") %>%
  mutate(diff_num = as.integer(factor(difficulty, levels = DIFF_ORD)))

# Background tier shading — simple rect bands by difficulty bucket
# Use transparent horizontal stripes to mark easy/medium/hard zones
band_df <- data.frame(
  xmin = c(0.5, 1.5, 2.5),
  xmax = c(1.5, 2.5, 3.5),
  label = DIFF_ORD,
  fill  = c("#00FFE008", "#9B59B608", "#FF475708")
)

p <- ggplot(diff_sum, aes(x = diff_num, y = mean_score, color = model_family)) +
  # Background difficulty bands
  geom_rect(
    data = band_df,
    aes(xmin = xmin, xmax = xmax, ymin = 0, ymax = 1.02, fill = fill),
    inherit.aes = FALSE, alpha = 1
  ) +
  scale_fill_identity() +
  # Dashed pass threshold
  geom_hline(yintercept = 0.5, linetype = "dashed",
             color = "#FFD700", linewidth = 0.6, alpha = 0.7) +
  # SE ribbon
  geom_ribbon(
    aes(ymin = mean_score - se, ymax = mean_score + se, fill = model_family),
    alpha = 0.12, color = NA, show.legend = FALSE
  ) +
  # Lines
  geom_line(linewidth = 1.1, alpha = 0.9) +
  # Points
  geom_point(size = 3.5, shape = 21,
             aes(fill = model_family), color = "white",
             stroke = 0.6, show.legend = FALSE) +
  # Score labels
  geom_text(
    aes(label = sprintf("%.2f", mean_score)),
    vjust = -1.1, size = 3, fontface = "bold"
  ) +
  scale_color_manual(values = PALETTE, name = "Model") +
  scale_fill_manual (values = PALETTE, guide = "none") +
  scale_x_continuous(
    breaks = 1:3,
    labels = DIFF_ORD,
    limits = c(0.5, 3.5)
  ) +
  scale_y_continuous(limits = c(0, 1.08), labels = percent_format(1),
                     breaks = seq(0, 1, 0.25)) +
  labs(
    title    = "Score by Difficulty Level",
    subtitle = "Mean ± SE ribbon  ·  Dashed = pass threshold (0.50)  ·  Bands: basic / intermediate / advanced",
    x = "Difficulty",
    y = "Average Score"
  ) +
  theme_minimal(base_size = 13) +
  theme(
    plot.background   = element_rect(fill = DARK_BG,    color = NA),
    panel.background  = element_rect(fill = DARK_PANEL, color = NA),
    panel.grid.major  = element_line(color = "#1E2A50", linewidth = 0.3),
    panel.grid.minor  = element_blank(),
    panel.border      = element_rect(fill = NA, color = "#00FFE022"),
    axis.text         = element_text(color = TEXT_CLR, size = 11),
    axis.title        = element_text(color = TEXT_CLR, size = 11),
    legend.background = element_rect(fill = DARK_BG, color = NA),
    legend.text       = element_text(color = TEXT_CLR),
    legend.title      = element_text(color = "#00FFE0", face = "bold"),
    plot.title        = element_text(color = "#00FFE0", face = "bold", size = 15, hjust = 0.5),
    plot.subtitle     = element_text(color = "#8BAFC0", size = 9, hjust = 0.5),
    plot.margin       = margin(16, 24, 16, 16)
  )

dir.create("figures",     showWarnings = FALSE)
dir.create("interactive", showWarnings = FALSE)

ggsave("figures/14_difficulty.png", plot = p,
       width = 2400, height = 1600, units = "px", dpi = 200, bg = DARK_BG)
message("Saved: figures/14_difficulty.png")

# Interactive plotly
p_ly <- ggplotly(p, tooltip = c("x", "y", "colour")) %>%
  layout(
    paper_bgcolor = DARK_BG, plot_bgcolor = DARK_PANEL,
    font = list(color = TEXT_CLR),
    legend = list(font = list(color = TEXT_CLR))
  )
htmlwidgets::saveWidget(p_ly, "interactive/14_difficulty.html", selfcontained = FALSE)
message("Saved: interactive/14_difficulty.html")
message("14_difficulty.R complete.\n")
