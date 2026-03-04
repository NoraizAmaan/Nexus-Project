const debug = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/members");
        console.log("Status:", res.status);
        console.log("Text:", await res.text());
    } catch (e) {
        console.error(e);
    }
};
debug();
