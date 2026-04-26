## 13_pass_rate.R
## Pass-rate heatmap: rows = tier, cols = model.
## Cell text: "X/Y tasks passed" + percentage.
## Outputs: figures/13_pass_rate.png (2000×1200)
##          interactive/13_pass_rate.html

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
DARK_BG    <- "#0A0F1E"
DARK_PANEL <- "#0D1426"
TEXT_CLR   <- "#E8F4F8"
PASS_THR   <- 0.5

if (!file.exists("data/benchmark_clean.rds")) stop("Run 00_load_data.R first.")
df <- readRDS("data/benchmark_clean.rds")

COMPLETE <- c("claude", "chatgpt", "deepseek", "gemini", "mistral")
df_c <- df %>%
  filter(model_family %in% COMPLETE) %>%
  mutate(model_family = factor(model_family, levels = COMPLETE))

pass_heat <- df_c %>%
  group_by(tier, model_family) %>%
  summarise(
    n_pass  = sum(final_score >= PASS_THR, na.rm = TRUE),
    n_total = n(),
    rate    = n_pass / n_total,
    .groups = "drop"
  ) %>%
  mutate(
    tier_lab = paste0("Tier ", tier),
    cell_lbl = sprintf("%d/%d\n(%.0f%%)", n_pass, n_total, rate * 100)
  )

TIERS <- paste0("Tier ", sort(unique(pass_heat$tier)))
pass_heat <- pass_heat %>%
  mutate(tier_lab = factor(tier_lab, levels = rev(TIERS)))

p <- ggplot(pass_heat, aes(x = model_family, y = tier_lab, fill = rate)) +
  geom_tile(color = DARK_BG, linewidth = 1) +
  geom_text(aes(label = cell_lbl),
            color = "white", size = 4, lineheight = 1.3, fontface = "bold") +
  scale_fill_gradient2(
    low      = "#FF4757",
    mid      = "#FFD700",
    high     = "#00FFE0",
    midpoint = 0.5,
    limits   = c(0, 1),
    name     = "Pass Rate",
    labels   = percent_format(1),
    guide    = guide_colorbar(barheight = 6, barwidth = 0.8)
  ) +
  scale_x_discrete(position = "top") +
  labs(
    title    = "Pass Rate Heatmap — Tier × Model",
    subtitle = "Cells show: tasks passed / total  (pass threshold = 0.50)",
    x = NULL, y = NULL
  ) +
  theme_minimal(base_size = 12) +
  theme(
    plot.background   = element_rect(fill = DARK_BG,    color = NA),
    panel.background  = element_rect(fill = DARK_PANEL, color = NA),
    panel.grid        = element_blank(),
    axis.text.x       = element_text(color = TEXT_CLR, size = 12, face = "bold"),
    axis.text.y       = element_text(color = TEXT_CLR, size = 11),
    legend.background = element_rect(fill = DARK_BG, color = NA),
    legend.text       = element_text(color = TEXT_CLR),
    legend.title      = element_text(color = "#00FFE0", face = "bold"),
    plot.title        = element_text(color = "#00FFE0", face = "bold", size = 14, hjust = 0.5),
    plot.subtitle     = element_text(color = "#8BAFC0", size = 9, hjust = 0.5),
    plot.margin       = margin(16, 16, 16, 16)
  )

dir.create("figures",     showWarnings = FALSE)
dir.create("interactive", showWarnings = FALSE)

ggsave("figures/13_pass_rate.png", plot = p,
       width = 2000, height = 1200, units = "px", dpi = 200, bg = DARK_BG)
message("Saved: figures/13_pass_rate.png")

# Interactive plotly heatmap
pass_wide <- pass_heat %>%
  select(tier_lab, model_family, rate) %>%
  tidyr::pivot_wider(names_from = model_family, values_from = rate)

mat  <- as.matrix(pass_wide[, COMPLETE])
rownames(mat) <- pass_wide$tier_lab

pass_wide_lbl <- pass_heat %>%
  select(tier_lab, model_family, cell_lbl) %>%
  tidyr::pivot_wider(names_from = model_family, values_from = cell_lbl)
mat_lbl <- as.matrix(pass_wide_lbl[, COMPLETE])

fig_ly <- plot_ly(
  z         = mat,
  x         = COMPLETE,
  y         = pass_wide$tier_lab,
  text      = mat_lbl,
  texttemplate = "%{text}",
  type      = "heatmap",
  colorscale = list(c(0,"#FF4757"), c(0.5,"#FFD700"), c(1,"#00FFE0")),
  zmin = 0, zmax = 1,
  colorbar  = list(title = "Pass Rate",
                   tickformat = ".0%",
                   tickfont = list(color = TEXT_CLR),
                   titlefont = list(color = "#00FFE0")),
  hovertemplate = "Model: %{x}<br>%{y}<br>Pass rate: %{z:.1%}<extra></extra>"
) %>%
  layout(
    title  = list(text = "Pass Rate: Tier × Model",
                  font = list(color = "#00FFE0", size = 15)),
    xaxis  = list(tickfont = list(color = TEXT_CLR)),
    yaxis  = list(tickfont = list(color = TEXT_CLR)),
    paper_bgcolor = DARK_BG,
    plot_bgcolor  = DARK_PANEL,
    font   = list(color = TEXT_CLR)
  )

htmlwidgets::saveWidget(fig_ly, "interactive/13_pass_rate.html", selfcontained = FALSE)
message("Saved: interactive/13_pass_rate.html")
message("13_pass_rate.R complete.\n")
