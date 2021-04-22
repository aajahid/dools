window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
            var version : string = process.versions[type] ? (process.versions[type] as string) : "";
            replaceText(`${type}-version`, version);
    }
})