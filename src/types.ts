import {
  HassEntities,
  HassConfig,
  Auth,
  Connection,
  MessageBase,
  HassEntityBase,
  HassEntityAttributeBase,
  HassServices,
} from "home-assistant-js-websocket";
import { LocalizeFunc } from "./common/translations/localize";

declare global {
  var __DEV__: boolean;
  var __DEMO__: boolean;
  var __BUILD__: "latest" | "es5";
  var __VERSION__: string;
  var __STATIC_PATH__: string;
}

declare global {
  interface Window {
    // Custom panel entry point url
    customPanelJS: string;
    ShadyCSS: {
      nativeCss: boolean;
      nativeShadow: boolean;
      prepareTemplate(templateElement, elementName, elementExtension);
      styleElement(element);
      styleSubtree(element, overrideProperties);
      styleDocument(overrideProperties);
      getComputedStyleValue(element, propertyName);
    };
  }
  // for fire event
  interface HASSDomEvents {
    "value-changed": {
      value: unknown;
    };
    change: undefined;
  }
}

export interface WebhookError {
  code: number;
  message: string;
}

export interface Credential {
  auth_provider_type: string;
  auth_provider_id: string;
}

export interface MFAModule {
  id: string;
  name: string;
  enabled: boolean;
}

export interface CurrentUser {
  id: string;
  is_owner: boolean;
  is_admin: boolean;
  name: string;
  credentials: Credential[];
  mfa_modules: MFAModule[];
}

export interface Theme {
  // Incomplete
  "primary-color": string;
  "text-primary-color": string;
  "accent-color": string;
}

export interface Themes {
  default_theme: string;
  themes: { [key: string]: Theme };
}

export interface Panel {
  component_name: string;
  config: { [key: string]: any } | null;
  icon: string | null;
  title: string | null;
  url_path: string;
}

export interface Panels {
  [name: string]: Panel;
}

export interface Translation {
  nativeName: string;
  isRTL: boolean;
  fingerprints: { [fragment: string]: string };
}

export interface Notification {
  notification_id: string;
  message: string;
  title: string;
  status: "read" | "unread";
  created_at: string;
}

export interface Resources {
  [language: string]: { [key: string]: string };
}

export interface HomeAssistant {
  auth: Auth;
  connection: Connection;
  connected: boolean;
  states: HassEntities;
  services: HassServices;
  config: HassConfig;
  themes: Themes;
  selectedTheme?: string | null;
  panels: Panels;
  panelUrl: string;

  // i18n
  // current effective language, in that order:
  //   - backend saved user selected lanugage
  //   - language in local appstorage
  //   - browser language
  //   - english (en)
  language: string;
  // local stored language, keep that name for backward compability
  selectedLanguage: string;
  resources: Resources;
  localize: LocalizeFunc;
  translationMetadata: {
    fragments: string[];
    translations: {
      [lang: string]: Translation;
    };
  };

  dockedSidebar: boolean;
  moreInfoEntityId: string;
  user?: CurrentUser;
  callService: (
    domain: string,
    service: string,
    serviceData?: { [key: string]: any }
  ) => Promise<void>;
  callApi: <T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    parameters?: { [key: string]: any }
  ) => Promise<T>;
  fetchWithAuth: (
    path: string,
    init?: { [key: string]: any }
  ) => Promise<Response>;
  sendWS: (msg: MessageBase) => Promise<void>;
  callWS: <T>(msg: MessageBase) => Promise<T>;
}

export type ClimateEntity = HassEntityBase & {
  attributes: HassEntityAttributeBase & {
    current_temperature: number;
    min_temp: number;
    max_temp: number;
    temperature: number;
    target_temp_step?: number;
    target_temp_high?: number;
    target_temp_low?: number;
    target_humidity?: number;
    target_humidity_low?: number;
    target_humidity_high?: number;
    fan_mode?: string;
    fan_list?: string[];
    operation_mode?: string;
    operation_list?: string[];
    hold_mode?: string;
    swing_mode?: string;
    swing_list?: string[];
    away_mode?: "on" | "off";
    aux_heat?: "on" | "off";
  };
};

export type LightEntity = HassEntityBase & {
  attributes: HassEntityAttributeBase & {
    min_mireds: number;
    max_mireds: number;
    friendly_name: string;
    brightness: number;
    hs_color: number[];
  };
};

export type GroupEntity = HassEntityBase & {
  attributes: HassEntityAttributeBase & {
    entity_id: string[];
    order: number;
    auto?: boolean;
    view?: boolean;
    control?: "hidden";
  };
};

export type CameraEntity = HassEntityBase & {
  attributes: HassEntityAttributeBase & {
    model_name: string;
    access_token: string;
    brand: string;
    motion_detection: boolean;
  };
};

export interface PanelInfo<T = unknown> {
  component_name: string;
  icon?: string;
  title?: string;
  url_path: string;
  config: T;
}

export interface Route {
  prefix: string;
  path: string;
}

export interface PanelElement extends HTMLElement {
  hass?: HomeAssistant;
  narrow?: boolean;
  route?: Route | null;
  panel?: Panel;
}

export interface LocalizeMixin {
  hass?: HomeAssistant;
  localize: LocalizeFunc;
}
