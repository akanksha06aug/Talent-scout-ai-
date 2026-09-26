let resumeText = "";

async function analyzeResume() {

    const fileInput = document.getElementById("resumeFile");
    const skillsInput = document.getElementById("requiredSkills");

    if (!fileInput.files.length) {
        alert("Please upload a resume first.");
        return;
    }

    const file = fileInput.files[0];

    if (file.type === "text/plain") {

        resumeText = await file.text();

        processResume(skillsInput.value);

    } else if (file.type === "application/pdf") {

        const reader = new FileReader();

        reader.onload = async function () {

            const typedArray = new Uint8Array(reader.result);

            const pdf = await pdfjsLib.getDocument({
                data: typedArray
            }).promise;

            let text = "";

            for (let i = 1; i <= pdf.numPages; i++) {

                const page = await pdf.getPage(i);

                const content = await page.getTextContent();

                text += content.items
                    .map(item => item.str)
                    .join(" ");
            }

            resumeText = text;

            processResume(skillsInput.value);
        };

        reader.readAsArrayBuffer(file);

    } else {

        alert("Please upload a PDF or TXT resume.");

    }
}


function processResume(requiredSkills) {

    const result = document.getElementById("result");

    result.classList.remove("hidden");

    const resume = resumeText.toLowerCase();

    const skills = requiredSkills
        .split(",")
        .map(skill => skill.trim().toLowerCase())
        .filter(skill => skill.length > 0);


    let matched = [];
    let missing = [];


    skills.forEach(skill => {

        if (resume.includes(skill)) {
            matched.push(skill);
        } else {
            missing.push(skill);
        }

    });


    let score = 0;

    if (skills.length > 0) {

        score = Math.round(
            (matched.length / skills.length) * 100
        );

    }


    document.getElementById("score").innerText =
        score + "%";


    document.getElementById("matchedSkills").innerText =
        matched.length
            ? matched.join(", ")
            : "No matching skills found";


    document.getElementById("missingSkills").innerText =
        missing.length
            ? missing.join(", ")
            : "No major missing skills";


    checkCompleteness(resume);

    checkQuality(resume, score);

}


function checkCompleteness(resume) {

    const sections = [
        "education",
        "experience",
        "skills",
        "project",
        "contact"
    ];

    let found = 0;

    sections.forEach(section => {

        if (resume.includes(section)) {
            found++;
        }

    });


    const percentage =
        Math.round((found / sections.length) * 100);


    document.getElementById("completeness").innerText =
        percentage + "% complete";


    if (percentage < 60) {

        document.getElementById("completeness").innerText +=
            " — Some important sections may be missing.";

    }

}


function checkQuality(resume, score) {

    let warnings = [];


    if (resume.length < 300) {
        warnings.push("Resume contains very little information.");
    }


    if (
        !resume.includes("@") &&
        !resume.includes("email")
    ) {
        warnings.push("No obvious email/contact information found.");
    }


    if (
        !resume.includes("education")
    ) {
        warnings.push("Education section not detected.");
    }


    if (
        !resume.includes("skills")
    ) {
        warnings.push("Skills section not detected.");
    }


    if (warnings.length === 0) {

        document.getElementById("quality").innerText =
            "Resume appears structurally complete.";

    } else {

        document.getElementById("quality").innerText =
            warnings.join(" ");

    }


    let recommendation;


    if (score >= 80) {

        recommendation =
            "Strong skill match. Consider this resume for the next screening stage.";

    } else if (score >= 50) {

        recommendation =
            "Moderate skill match. Review the resume manually.";

    } else {

        recommendation =
            "Low skill match. Additional review may be required.";

    }


    document.getElementById("recommendation").innerText =
        recommendation;

}


function checkLogic() {

    const answer =
        document.getElementById("logicAnswer").value;

    const result =
        document.getElementById("logicResult");


    if (answer == 180) {

        result.innerText =
            "🎉 Correct! You solved Mission 1.";

    } else {

        result.innerText =
            "❌ Try again.";

    }

}


function checkIdea() {

    const idea =
        document.getElementById("idea").value.trim();

    const result =
        document.getElementById("ideaResult");


    if (idea.length >= 20) {

        result.innerText =
            "🏆 Good idea! Mission 2 completed.";

    } else {

        result.innerText =
            "💡 Explain your idea in a little more detail.";

    }

}
