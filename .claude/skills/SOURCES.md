# Skills instaladas

| Pasta | Nome (frontmatter) | Origem |
|---|---|---|
| `brand-identity-directions/` | `brand-identity-directions` | https://github.com/dhernz/brand-identity (`skills/brand-identity`) — renomeada para não colidir com a da rampstackco |
| `design/` | `ckm:design` | https://github.com/Talktodre-ops/claude-skills (`design/`) |
| `design-system/` | `design-system` | https://github.com/rampstackco/claude-skills (`skills/design-system`) |
| `brand-identity/` | `brand-identity` | https://github.com/rampstackco/claude-skills (`skills/brand-identity`) |
| `design-md/` | `design-md` | https://github.com/moesuito/claude-skill-design-md |

Notas:
- Do repo dhernz só a pasta da skill foi copiada; o hook de auto-update (`hooks/check-update.sh`, faz `curl` remoto) ficou de fora.
- Os scripts de logo/ícone/CIP da skill `design` usam a API do Gemini e exigem `GEMINI_API_KEY` + `pip install google-genai`. O resto da skill funciona sem isso.
- A skill `design` referencia outras skills do mesmo repo (`ckm:design-system`, `ui-styling`, `slides`, `banner-design`) que não foram instaladas.
