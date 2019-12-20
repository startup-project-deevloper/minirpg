export const typeWriter = ({ text, onStart = () => { }, onTyped = str => { }, onFinished = () => { } }) => {
    let animId = "";
    let str = "";

    onStart();

    const t = (s = "", i = 0) => {
        if (i > text.length) {
            cancelAnimationFrame(animId);
            onFinished();
            return;
        }

        str = s + text.charAt(i);

        i += 1;
        onTyped(str);

        requestAnimationFrame(() => t(str, i));
    };

    return {
        start: () => (animId = requestAnimationFrame(() => t()))
    };
};