import {
  html,
  LitElement,
  TemplateResult,
  customElement,
  property,
} from "lit-element";
import "@polymer/paper-input/paper-input";

import { struct } from "../../common/structs/struct";
import {
  EntitiesEditorEvent,
  EditorTarget,
  actionConfigStruct,
} from "../types";
import { HomeAssistant } from "../../../../types";
import { LovelaceCardEditor } from "../../types";
import { fireEvent } from "../../../../common/dom/fire_event";
import { Config } from "../../cards/hui-entity-button-card";
import { configElementStyle } from "./config-elements-style";
import { ActionConfig } from "../../../../data/lovelace";

import "../../components/hui-action-editor";
import "../../components/hui-theme-select-editor";
import "../../components/hui-entity-editor";

const cardConfigStruct = struct({
  type: "string",
  entity: "string?",
  name: "string?",
  show_name: "boolean?",
  icon: "string?",
  show_icon: "boolean?",
  tap_action: struct.optional(actionConfigStruct),
  hold_action: struct.optional(actionConfigStruct),
  theme: "string?",
});

@customElement("hui-entity-button-card-editor")
export class HuiEntityButtonCardEditor extends LitElement
  implements LovelaceCardEditor {
  @property() public hass?: HomeAssistant;

  @property() private _config?: Config;

  public setConfig(config: Config): void {
    config = cardConfigStruct(config);
    this._config = config;
  }

  get _entity(): string {
    return this._config!.entity || "";
  }

  get _name(): string {
    return this._config!.name || "";
  }

  get _show_name(): boolean {
    return this._config!.show_name || true;
  }

  get _icon(): string {
    return this._config!.icon || "";
  }

  get _show_icon(): boolean {
    return this._config!.show_icon || true;
  }

  get _tap_action(): ActionConfig {
    return this._config!.tap_action || { action: "more-info" };
  }

  get _hold_action(): ActionConfig {
    return this._config!.hold_action || { action: "none" };
  }

  get _theme(): string {
    return this._config!.theme || "default";
  }

  protected render(): TemplateResult | void {
    if (!this.hass) {
      return html``;
    }

    const actions = ["more-info", "toggle", "navigate", "call-service", "none"];

    return html`
      ${configElementStyle}
      <div class="card-config">
        <ha-entity-picker
          .hass="${this.hass}"
          .value="${this._entity}"
          .configValue=${"entity"}
          @change="${this._valueChanged}"
          allow-custom-entity
        ></ha-entity-picker>
        <div class="side-by-side">
          <paper-input
            label="Name (Optional)"
            .value="${this._name}"
            .configValue="${"name"}"
            @value-changed="${this._valueChanged}"
          ></paper-input>
          <paper-input
            label="Icon (Optional)"
            .value="${this._icon}"
            .configValue="${"icon"}"
            @value-changed="${this._valueChanged}"
          ></paper-input>
        </div>
        <div class="side-by-side">
          <paper-toggle-button
            ?checked="${this._config!.show_name !== false}"
            .configValue="${"show_name"}"
            @change="${this._valueChanged}"
            >Show Name?</paper-toggle-button
          >
          <paper-toggle-button
            ?checked="${this._config!.show_icon !== false}"
            .configValue="${"show_icon"}"
            @change="${this._valueChanged}"
            >Show Icon?</paper-toggle-button
          >
        </div>
        <hui-theme-select-editor
          .hass="${this.hass}"
          .value="${this._theme}"
          .configValue="${"theme"}"
          @theme-changed="${this._valueChanged}"
        ></hui-theme-select-editor>
        <div class="side-by-side">
          <hui-action-editor
            label="Tap Action"
            .hass="${this.hass}"
            .config="${this._tap_action}"
            .actions="${actions}"
            .configValue="${"tap_action"}"
            @action-changed="${this._valueChanged}"
          ></hui-action-editor>
          <hui-action-editor
            label="Hold Action"
            .hass="${this.hass}"
            .config="${this._hold_action}"
            .actions="${actions}"
            .configValue="${"hold_action"}"
            @action-changed="${this._valueChanged}"
          ></hui-action-editor>
        </div>
      </div>
    `;
  }

  private _valueChanged(ev: EntitiesEditorEvent): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target! as EditorTarget;

    if (
      this[`_${target.configValue}`] === target.value ||
      this[`_${target.configValue}`] === target.config
    ) {
      return;
    }
    if (target.configValue) {
      if (target.value === "") {
        delete this._config[target.configValue!];
      } else {
        this._config = {
          ...this._config,
          [target.configValue!]:
            target.checked !== undefined
              ? target.checked
              : target.value
              ? target.value
              : target.config,
        };
      }
    }
    fireEvent(this, "config-changed", { config: this._config });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-entity-button-card-editor": HuiEntityButtonCardEditor;
  }
}
