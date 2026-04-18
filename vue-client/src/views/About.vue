<!-- I AM STEALING THE "https://oepatients.org/make-web-pages-easier-on-the-eyes/" FORMATTING AND IF ANYBODY SAYS ANYTHING I WILL GET VERY VERY ANGRY // Kerim -->
<template>
    <div class="about-container">
        <h1>Ticks represent a significant concern within animal health, making a comprehensive understanding of their geographical distribution critically important.</h1>

        <div class="card">
            <p>The Elanco Tick Sighting Visualiser is a data intelligence and public health awareness tool. In a business context, the project solves the operational challenge of managing inaccurate, inconsistent real-world datasets by establishing a robust data-cleaning pipeline.</p>
            <br />
            <p>The resulting structured data is then deployed via a web-based spatial dashboard. This allows the business to provide valuable, location-specific insights regarding tick prevalence to its stakeholders, thereby directly contributing to public health awareness, supporting animal welfare initiatives, and reinforcing corporate social responsibility.</p>
        </div>
    </div>
</template>

<style scoped>
    .about-container {
        padding-top: var(--top-padding);
        max-width: 1000px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
    }
        .about-container .card {
            height: auto !important;
            min-height: fit-content;
            overflow-wrap: break-word;
            word-wrap: break-word;
        }

    h1 {
        font-size: calc(32px * var(--font-scale, 1));
        font-weight: bold;
        text-align: center;
        line-height: 1.6;
        margin-bottom: 40px;
        padding: 0 20px;
        overflow-wrap: break-word;
    }

    p {
        font-size: calc(18px * var(--font-scale, 1));
        line-height: 1.7;
        letter-spacing: 0.5px;
    }

    @media (max-width: 900px) {
        .about-container {
            padding-top: var(--mobile-header-height);
            padding-left: 12px;
            padding-right: 12px;
            max-width: 100%;
            margin: 0;
            overflow-x: hidden;
        }

            .about-container .card {
                margin: 16px 0;
                padding: 16px;
            }

        h1 {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            line-height: 1.4;
            margin-bottom: 16px;
            padding: 0;
        }

        p {
            font-size: 15px;
            line-height: 1.5;
            letter-spacing: 0.2px;
        }
    }
</style>