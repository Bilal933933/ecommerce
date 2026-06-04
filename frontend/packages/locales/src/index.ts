import { app as arApp } from "./ar/app";
import { app as enApp } from "./en/app";

import { auth as arAuth } from "./ar/auth";
import { auth as enAuth } from "./en/auth";

import { levelAdmin as arlevelAdmin } from "./admin/ar/level.admin";
import { levelAdmin as enlevelAdmin } from "./admin/en/level.admin";

import { fileAdmin as arFileAdmin } from "./admin/ar/file.admin";
import { fileAdmin as enFileAdmin } from "./admin/en/file.admin";

import { landing as arLanding } from "./ar/landing";
import { landing as enLanding } from "./en/landing";

import { dashboard as arDashboard } from "./ar/dashboard";
import { dashboard as enDashboard } from "./en/dashboard";

import { profile as arProfile } from "./ar/profile";
import { profile as enProfile } from "./en/profile";

import { settings as arSettings } from "./ar/settings";
import { settings as enSettings } from "./en/settings";

import { about as arAbout } from "./ar/about";
import { about as enAbout } from "./en/about";

import { seo as arSeo } from "./ar/seo";
import { seo as enSeo } from "./en/seo";

export const locales = {
    ar: {
        app: arApp,
        auth: arAuth,
        levelAdmin: arlevelAdmin,
        fileAdmin: arFileAdmin,
        landing: arLanding,
        dashboard: arDashboard,
        profile: arProfile,
        settings: arSettings,
        about: arAbout,
        seo: arSeo,
    },
    en: {
        app: enApp,
        auth: enAuth,
        levelAdmin: enlevelAdmin,
        fileAdmin: enFileAdmin,
        landing: enLanding,
        dashboard: enDashboard,
        profile: enProfile,
        settings: enSettings,
        about: enAbout,
        seo: enSeo,
    }
} as const

export type Locale = keyof typeof locales
