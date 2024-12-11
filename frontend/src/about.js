import React from "react";

const About = () => {
    return (

        <main>
            <section style={{ marginBottom: "35px" }}>
                <h1 style={{ textAlign: "center", marginTop: "15px", fontStyle: "italic" }}>About</h1>

                <div className="container">
                    <br />
                    <h3 style={{ textAlign: "center" }}>Project Info</h3>
                    <p className="mb-1" style={{ textAlign: "center" }}>Created for  <strong>COM S 3190</strong>.</p>
                    <p className="mb-1" style={{ textAlign: "center" }}>Instructed by <strong>Dr. Abraham N. Aldaco Gastelum</strong>.</p>
                    <p className="mb-1" style={{ textAlign: "center" }}>December 2024.</p>
                    <br />
                    <h3 style={{ textAlign: "center" }}>Author Info</h3>
                    <p className="mb-1" style={{ textAlign: "center" }}>Christian Borek (cborek@iastate.edu)</p>
                    <p className="mb-1" style={{ textAlign: "center" }}>Eddie Gong (egong@iastate.edu)</p>
                    <br />
                    <p className="mb-1" style={{ textAlign: "center" }}>22s2.</p>
                </div>
            </section>
        </main>
    );
};

export default About;
