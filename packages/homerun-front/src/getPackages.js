import { readdirSync } from "fs";
import glob from "glob";

function importAllPreview(r) {
    return r.keys().map((fileName) => {
        let screenshots, debs, icon, banner, changelogs;
        const root = `./public/packages/${fileName.split("/")[1]}`;
        //prettier-ignore
        try {
            screenshots = glob.sync(`${root}/screenshots/*.+(png|jpg|jpeg)`).map((f) => f.substr(root.length + 1)) || [];
            debs = glob.sync(`${root}/debs/*.deb`).map((f) => f.substr(root.length + 1)) || [];
            icon = glob.sync(`${root}/icon.+(png|jpg|jpeg)`).map((f) => f.substr(root.length + 1))[0] || null;
            banner = glob.sync(`${root}/banner.+(png|jpg|jpeg)`).map((f) => f.substr(root.length + 1))[0] || null;
            changelogs = glob.sync(`${root}/changelogs/*.+(md|mdx)`).map((f) => ({
                number: f.split('/').pop().replace(/\.mdx?$/, ''),
                file: f.substr(root.length + 1)
            })).sort((a, b) => -1) || [];
        } catch (e) {}
        return {
            ...r(fileName),
            screenshots: screenshots,
            debs: debs,
            icon: icon,
            banner: banner,
            changelogs: changelogs,
        };
    });
}

export function getAllPackagePreview() {
    return importAllPreview(
        require.context("../public/packages", true, /\.js/)
    ).sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
}

export function getPackagePreview(slug) {
    return getAllPackagePreview().filter((p) => p.slug === slug)[0];
}
