(function () {
    try {
    const packageCatalog = {
        'website-preview-launch': {
            name: 'Preview Launch Site',
            price: '$500',
            family: 'website',
            profile: 'website-basic',
            goalLabel: 'What is this preview page for?',
            goalPlaceholder: 'Tell us the main purpose of the page and what you want visitors to do when they land on it.'
        },
        'website-live-essential': {
            name: 'Essential Launch Site',
            price: '$700',
            family: 'website',
            profile: 'website-basic',
            goalLabel: 'What should this website help your business do?',
            goalPlaceholder: 'Example: generate calls, show services clearly, look more professional, or launch a simple business site.'
        },
        'website-live-plus': {
            name: 'Essential Launch Plus',
            price: '$850',
            family: 'website',
            profile: 'website-basic',
            goalLabel: 'What are we building, and what should it accomplish?',
            goalPlaceholder: 'Give us the short version. We only need enough to start the build cleanly.'
        },
        'website-search-foundation': {
            name: 'Search Foundation Site',
            price: '$1,200',
            family: 'website',
            profile: 'website-local',
            goalLabel: 'What should this search-ready site help you get more of?',
            goalPlaceholder: 'Example: local calls, quote requests, or a stronger Google-ready site.'
        },
        'website-search-foundation-plus': {
            name: 'Search Foundation Plus',
            price: '$1,500',
            family: 'website',
            profile: 'website-local',
            goalLabel: 'What should this search-ready site help your business do?',
            goalPlaceholder: 'Give us the core goal first. We can fill in the rest with you after checkout.',
            paymentOptions: [
                {
                    value: 'full',
                    label: 'Pay in full - $1,500',
                    help: 'One-time payment through Stripe.'
                },
                {
                    value: 'deposit',
                    label: 'Reserve kickoff with a $750 deposit',
                    help: 'Deposit is applied to the project total. Remaining balance is invoiced before launch.'
                }
            ]
        },
        'website-local-seo-starter': {
            name: 'Local Launch Site',
            price: '$1,997',
            family: 'website',
            profile: 'website-local',
            goalLabel: 'What should this website help you get more of?',
            goalPlaceholder: 'Example: more calls, more quote requests, cleaner positioning, or better Google visibility.',
            paymentOptions: [
                {
                    value: 'full',
                    label: 'Pay in full - $1,997',
                    help: 'One-time payment through Stripe.'
                },
                {
                    value: 'deposit',
                    label: 'Reserve kickoff with a $1,000 deposit',
                    help: 'Deposit is applied to the project total. Remaining balance is invoiced during milestone approvals.'
                }
            ]
        },
        'website-local-launch-plus': {
            name: 'Local Launch Plus',
            price: '$2,997',
            family: 'website',
            profile: 'website-local',
            goalLabel: 'What is the main growth goal for this larger local build?',
            goalPlaceholder: 'Example: cover multiple service areas, expand page depth, or launch a stronger lead-generation site.',
            paymentOptions: [
                {
                    value: 'full',
                    label: 'Pay in full - $2,997',
                    help: 'One-time payment through Stripe.'
                },
                {
                    value: 'deposit',
                    label: 'Reserve kickoff with a $1,500 deposit',
                    help: 'Deposit is applied to the project total. Remaining balance is invoiced during milestone approvals.'
                }
            ]
        },
        'website-local-launch-max': {
            name: 'Local Launch Max',
            price: '$4,500',
            family: 'website',
            profile: 'website-local',
            goalLabel: 'What makes this build larger or more complex?',
            goalPlaceholder: 'Example: larger page count, deeper service-area coverage, advanced tracking, or more complex lead flow.',
            paymentOptions: [
                {
                    value: 'full',
                    label: 'Pay in full - $4,500',
                    help: 'One-time payment through Stripe.'
                },
                {
                    value: 'deposit',
                    label: 'Reserve kickoff with a $2,000 deposit',
                    help: 'Deposit is applied to the project total. Remaining balance is invoiced across scoped milestones.'
                }
            ]
        },
        'ecommerce-preview-catalog': {
            name: 'Storefront Preview',
            price: '$750',
            family: 'ecommerce',
            profile: 'ecommerce',
            goalLabel: 'What kind of catalog or product showcase are we building?',
            goalPlaceholder: 'Example: product validation, portfolio-style catalog, or a preview before live checkout.'
        },
        'ecommerce-payment-links': {
            name: 'Payment-Link Store',
            price: '$1,200',
            family: 'ecommerce',
            profile: 'ecommerce',
            goalLabel: 'What should this store let people buy or request?',
            goalPlaceholder: 'Tell us the short version of what you sell and what kind of payment flow you want.'
        },
        'ecommerce-launch': {
            name: 'E-Commerce Launch',
            price: '$2,497',
            family: 'ecommerce',
            profile: 'ecommerce',
            goalLabel: 'What are we selling, and what should the buying process feel like?',
            goalPlaceholder: 'Example: clean cart flow, custom product pages, or a more polished online store than templates allow.',
            paymentOptions: [
                {
                    value: 'full',
                    label: 'Pay in full - $2,497',
                    help: 'One-time payment through Stripe.'
                },
                {
                    value: 'deposit',
                    label: 'Reserve kickoff with a $1,250 deposit',
                    help: 'Deposit is applied to the project total. Remaining balance is invoiced before final launch.'
                }
            ]
        },
        'ecommerce-growth-store': {
            name: 'E-Commerce Growth Store',
            price: '$3,997',
            family: 'ecommerce',
            profile: 'ecommerce',
            goalLabel: 'What makes this store more complex than a basic launch?',
            goalPlaceholder: 'Example: larger catalog, variants, CMS editing, stronger reporting, or post-purchase automations.',
            paymentOptions: [
                {
                    value: 'full',
                    label: 'Pay in full - $3,997',
                    help: 'One-time payment through Stripe.'
                },
                {
                    value: 'deposit',
                    label: 'Reserve kickoff with a $2,000 deposit',
                    help: 'Deposit is applied to the project total. Remaining balance is invoiced across scoped milestones.'
                }
            ]
        },
        'ecommerce-advanced-system': {
            name: 'Advanced E-Commerce System',
            price: '$7,500',
            family: 'ecommerce',
            profile: 'ecommerce',
            goalLabel: 'What advanced store or system are we building?',
            goalPlaceholder: 'Example: dynamic inventory, admin editing, accounts, reporting, or complex purchase logic.',
            paymentOptions: [
                {
                    value: 'full',
                    label: 'Pay in full - $7,500',
                    help: 'One-time payment through Stripe.'
                },
                {
                    value: 'deposit',
                    label: 'Reserve strategy and kickoff with a $2,500 deposit',
                    help: 'Strategy deposit is applied to the project total. Remaining balance is invoiced after scope confirmation and milestones.'
                }
            ]
        },
        'gbp-optimization': {
            name: 'Google Business Profile Sprint',
            price: '$297',
            family: 'seo',
            profile: 'website-local',
            goalLabel: 'What do you want improved about your Google Business Profile?',
            goalPlaceholder: 'Example: better categories, services, conversion copy, Q&A, or a cleaner profile setup.'
        },
        'monthly-local-seo-starter': {
            name: 'Local Visibility Lite',
            price: '$197/mo',
            family: 'monthly',
            profile: 'monthly',
            goalLabel: 'What should we help you stay on top of every month?',
            goalPlaceholder: 'Example: light website edits, GBP upkeep, analytics checks, or basic visibility support.'
        },
        'monthly-visibility-standard': {
            name: 'Visibility Standard',
            price: '$397/mo',
            family: 'monthly',
            profile: 'monthly',
            goalLabel: 'What should we manage for you month to month?',
            goalPlaceholder: 'Example: monthly site updates, GBP posts, Search Console checks, or local SEO upkeep.'
        },
        'monthly-visibility-pro': {
            name: 'Visibility Pro',
            price: '$697/mo',
            family: 'monthly',
            profile: 'monthly',
            goalLabel: 'What is the biggest ongoing need we should handle each month?',
            goalPlaceholder: 'Example: website management, GBP support, citations, reviews, or lead-tracking help.'
        },
        'monthly-growth-management': {
            name: 'Growth Management',
            price: '$1,000/mo',
            family: 'monthly',
            profile: 'monthly',
            goalLabel: 'What would you want us actively managing every month?',
            goalPlaceholder: 'Example: CRM, reporting, content coordination, automation workflows, or a broader growth system.'
        },
        'ops-simple-lead-tracker': {
            name: 'Simple Lead Tracker',
            price: '$250',
            family: 'ops',
            profile: 'ops',
            goalLabel: 'What do you want this tracker to help you keep organized?',
            goalPlaceholder: 'Example: lead sources, quote pipeline, contact records, or sold job tracking.'
        },
        'ops-contractor-crm-starter': {
            name: 'Contractor CRM Starter',
            price: '$500',
            family: 'ops',
            profile: 'ops',
            goalLabel: 'What part of the CRM or follow-up process needs the most help?',
            goalPlaceholder: 'Example: tracking estimates, review follow-up, pipeline stages, or lead organization.'
        },
        'ops-job-records-system': {
            name: 'Job Records System',
            price: '$750',
            family: 'ops',
            profile: 'ops',
            goalLabel: 'What job records or documents need to be organized?',
            goalPlaceholder: 'Example: estimates, invoices, photos, work authorizations, or job folders.'
        },
        'ops-automated-job-records': {
            name: 'Automated Job Records',
            price: '$1,500',
            family: 'ops',
            profile: 'ops',
            goalLabel: 'What process do you want automated?',
            goalPlaceholder: 'Example: form submissions, folder creation, notifications, or tracker updates.',
            paymentOptions: [
                {
                    value: 'full',
                    label: 'Pay in full - $1,500',
                    help: 'One-time payment through Stripe.'
                },
                {
                    value: 'deposit',
                    label: 'Reserve kickoff with a $750 deposit',
                    help: 'Deposit is applied to the project total. Remaining balance is invoiced before handoff.'
                }
            ]
        },
        'ops-growth-system-starter': {
            name: 'Growth System Starter',
            price: '$3,500',
            family: 'ops',
            profile: 'ops',
            goalLabel: 'What business bottleneck should this system solve first?',
            goalPlaceholder: 'Example: lead tracking, review workflow, reporting, or a weak process behind the website.',
            paymentOptions: [
                {
                    value: 'full',
                    label: 'Pay in full - $3,500',
                    help: 'One-time payment through Stripe.'
                },
                {
                    value: 'deposit',
                    label: 'Reserve kickoff with a $1,750 deposit',
                    help: 'Deposit is applied to the project total. Remaining balance is invoiced across milestone approvals.'
                }
            ]
        },
        'ops-full-growth-system': {
            name: 'Full Growth System',
            price: '$5,000',
            family: 'ops',
            profile: 'ops',
            goalLabel: 'What should this full system improve most for the business?',
            goalPlaceholder: 'Example: lead flow, tracking, CRM, reporting, site and search alignment, or operations cleanup.',
            paymentOptions: [
                {
                    value: 'full',
                    label: 'Pay in full - $5,000',
                    help: 'One-time payment through Stripe.'
                },
                {
                    value: 'deposit',
                    label: 'Reserve strategy and kickoff with a $2,000 deposit',
                    help: 'Strategy deposit is applied to the project total. Remaining balance is invoiced after scope confirmation and milestones.'
                }
            ]
        },
        'ops-custom-automation-system': {
            name: 'Custom Automation System',
            price: '$10,000',
            family: 'ops',
            profile: 'ops',
            goalLabel: 'What workflow, system, or automation are we creating?',
            goalPlaceholder: 'Example: routing leads, dashboards, follow-up automation, reporting, or a custom internal tool.',
            paymentOptions: [
                {
                    value: 'full',
                    label: 'Pay in full - $10,000',
                    help: 'One-time payment through Stripe.'
                },
                {
                    value: 'deposit',
                    label: 'Reserve strategy and kickoff with a $2,500 deposit',
                    help: 'Strategy deposit is applied to the project total. Remaining balance is invoiced after scope confirmation and milestones.'
                }
            ]
        }
    };

    const productionCheckoutApiBase = 'https://knight-logics-local-preview.vercel.app';
    const splitHostedProductionHosts = new Set(['knightlogics.com', 'www.knightlogics.com']);
    const uploadFileLimit = 2 * 1024 * 1024;
    const uploadTotalLimit = 4 * 1024 * 1024;
    const checkoutDraftStorageKey = 'pricingPackageCheckoutDraft';
    const intakeSupportEmail = 'support@knightlogics.com';

    const intakeOverlay = document.getElementById('starterPackageIntake');
    const intakeDialog = intakeOverlay ? intakeOverlay.querySelector('.starter-package-intake-dialog') : null;
    const intakeForm = document.getElementById('starterPackageIntakeForm');
    const intakePackageKeyInput = document.getElementById('starterPackageIntakePackageKey');
    const intakePackageNameInput = document.getElementById('starterPackageIntakePackageName');
    const intakePackagePriceInput = document.getElementById('starterPackageIntakePackagePrice');
    const intakePackageLabel = document.getElementById('starterPackageIntakePackage');
    const intakeStatus = document.getElementById('starterPackageIntakeStatus');
    const intakeCloseButton = document.getElementById('starterPackageIntakeClose');
    const intakeCancelButton = document.getElementById('starterPackageIntakeCancel');
    const intakeSubmitButton = document.getElementById('starterPackageIntakeSubmit');
    const intakeSubmitText = intakeSubmitButton ? intakeSubmitButton.querySelector('span') : null;
    const intakeSubmitLoading = intakeSubmitButton ? intakeSubmitButton.querySelector('.btn-loading') : null;
    const configuratorLabel = document.getElementById('starterPackageConfiguratorLabel');
    const configuratorTitle = document.getElementById('starterPackageConfiguratorTitle');
    const configuratorCopy = document.getElementById('starterPackageConfiguratorCopy');
    const configuratorPrice = document.getElementById('starterPackageConfiguratorPrice');
    const configuratorMeta = document.getElementById('starterPackageConfiguratorMeta');
    const assuranceTitle = document.getElementById('starterPackageAssuranceTitle');
    const assuranceBody = document.getElementById('starterPackageAssuranceBody');
    const assuranceChips = document.getElementById('starterPackageAssuranceChips');
    const dynamicFields = document.getElementById('starterPackageDynamicFields');
    const businessNameInput = document.getElementById('starterPackageBusinessName');
    const contactNameInput = document.getElementById('starterPackageContactName');
    const emailInput = document.getElementById('starterPackageEmail');
    const phoneInput = document.getElementById('starterPackagePhone');
    const logoFileInput = document.getElementById('starterPackageLogoFile');
    const referenceFilesInput = document.getElementById('starterPackageReferenceFiles');
    const assetLinkInput = document.getElementById('starterPackageAssetLink');
    const additionalNotesInput = document.getElementById('starterPackageAdditionalNotes');
    const fileList = document.getElementById('starterPackageFileList');
    const intakeHelper = document.getElementById('starterPackageIntakeHelper');

    const successOverlay = document.getElementById('starterPackageSuccessOverlay');
    const successDialog = successOverlay ? successOverlay.querySelector('.starter-package-success-dialog') : null;
    const successPackageLabel = document.getElementById('starterPackageSuccessPackage');
    const successCopy = document.getElementById('starterPackageSuccessCopy');
    const successConfirmButton = document.getElementById('starterPackageSuccessConfirm');
    const successCloseButton = document.getElementById('starterPackageSuccessClose');

    const followupOverlay = document.getElementById('starterPackageFollowupOverlay');
    const followupDialog = followupOverlay ? followupOverlay.querySelector('.starter-package-followup-dialog') : null;
    const followupForm = document.getElementById('starterPackageFollowupForm');
    const followupStatus = document.getElementById('starterPackageFollowupStatus');
    const followupPackageLabel = document.getElementById('starterPackageFollowupPackage');
    const followupPackageKeyInput = document.getElementById('starterPackageFollowupPackageKey');
    const followupPackageNameInput = document.getElementById('starterPackageFollowupPackageName');
    const followupPackagePriceInput = document.getElementById('starterPackageFollowupPackagePrice');
    const followupSubmissionStageInput = document.getElementById('starterPackageFollowupSubmissionStage');
    const followupSubmissionTypeInput = document.getElementById('starterPackageFollowupSubmissionType');
    const followupSubjectInput = document.getElementById('starterPackageFollowupSubject');
    const followupBusinessNameInput = document.getElementById('starterPackageFollowupBusinessName');
    const followupContactNameInput = document.getElementById('starterPackageFollowupContactName');
    const followupEmailInput = document.getElementById('starterPackageFollowupEmail');
    const followupAssetLinkInput = document.getElementById('starterPackageFollowupAssetLink');
    const followupLogoFileInput = document.getElementById('starterPackageFollowupLogoFile');
    const followupAttachmentsInput = document.getElementById('starterPackageFollowupAttachments');
    const followupDetailsInput = document.getElementById('starterPackageFollowupDetails');
    const followupFileList = document.getElementById('starterPackageFollowupFileList');
    const followupSubmitButton = document.getElementById('starterPackageFollowupSubmit');
    const followupSubmitText = followupSubmitButton ? followupSubmitButton.querySelector('span') : null;
    const followupSubmitLoading = followupSubmitButton ? followupSubmitButton.querySelector('.btn-loading') : null;
    const followupCloseButton = document.getElementById('starterPackageFollowupClose');

    const pricingCtas = Array.from(document.querySelectorAll('.pricing-card-cta[href*="openPackage="]'));
    let activePackageKey = 'website-local-seo-starter';
    let lastTrigger = null;
    let activePurchaseReturnPackageKey = '';

    function getPackageDetails(packageKey) {
        return packageCatalog[packageKey] || {
            name: 'Starter package',
            price: '',
            family: 'website',
            profile: 'website-basic',
            goalLabel: 'What are we building for you?',
            goalPlaceholder: 'Tell us the short version so we can start cleanly.'
        };
    }

    function getCheckoutEndpoint() {
        const apiBase = splitHostedProductionHosts.has(window.location.hostname)
            ? productionCheckoutApiBase
            : window.location.origin;

        return new URL('/api/create-checkout-session', `${apiBase}/`).toString();
    }

    function getUploadEndpoint() {
        const apiBase = splitHostedProductionHosts.has(window.location.hostname)
            ? productionCheckoutApiBase
            : window.location.origin;

        return new URL('/api/package-intake-upload', `${apiBase}/`).toString();
    }

    function hasDepositOption(packageConfig) {
        return Array.isArray(packageConfig.paymentOptions) && packageConfig.paymentOptions.some((option) => option.value === 'deposit');
    }

    function getAssuranceData(packageConfig) {
        const baseChips = [
            'Secure Stripe checkout',
            'You do not need every detail right now',
            'Starter files can be attached now or after payment'
        ];

        if (packageConfig.family === 'monthly') {
            return {
                title: 'Simple onboarding before recurring checkout',
                body: 'This is just enough to start the relationship cleanly. Add the property we will be maintaining, the main monthly priority, and any starter files or links you already have.',
                chips: ['Month-to-month billing', 'Existing property required', 'Extra files can be sent after checkout']
            };
        }

        if (hasDepositOption(packageConfig)) {
            return {
                title: 'Secure checkout with a full-pay or deposit option',
                body: 'Use this starter form to lock in the package and attach anything helpful now. If you choose a deposit, it is applied to the project total and the remaining balance is handled in milestones.',
                chips: [...baseChips, 'Deposit is applied to the project total']
            };
        }

        return {
            title: '2-minute starter form before secure checkout',
            body: 'This is not a full discovery questionnaire. It is just enough to start the project cleanly, collect any starter files you already have, and move you into checkout without unnecessary friction.',
            chips: baseChips
        };
    }

    function formatBytes(bytes) {
        if (!Number.isFinite(bytes) || bytes <= 0) {
            return '0 KB';
        }

        if (bytes < 1024 * 1024) {
            return `${Math.max(1, Math.round(bytes / 1024))} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function updateFileList(target, primaryInput, secondaryInput) {
        if (!target) {
            return;
        }

        const entries = [];
        const logoFiles = primaryInput && primaryInput.files ? Array.from(primaryInput.files) : [];
        const starterFiles = secondaryInput && secondaryInput.files ? Array.from(secondaryInput.files) : [];

        logoFiles.forEach((file) => {
            entries.push(`Logo: ${file.name} (${formatBytes(file.size)})`);
        });

        starterFiles.forEach((file) => {
            entries.push(`Starter file: ${file.name} (${formatBytes(file.size)})`);
        });

        if (entries.length === 0) {
            target.innerHTML = '';
            return;
        }

        target.innerHTML = entries
            .map((entry) => `<div class="starter-package-file-list-item">${entry}</div>`)
            .join('');
    }

    function validateSelectedFiles(primaryInput, secondaryInput) {
        const logoFiles = primaryInput && primaryInput.files ? Array.from(primaryInput.files) : [];
        const starterFiles = secondaryInput && secondaryInput.files ? Array.from(secondaryInput.files) : [];
        const allFiles = [...logoFiles, ...starterFiles];

        let totalBytes = 0;

        for (const file of allFiles) {
            totalBytes += file.size;

            if (file.size > uploadFileLimit) {
                return `Keep each uploaded file under ${formatBytes(uploadFileLimit)}. Use a share link for anything larger.`;
            }
        }

        if (totalBytes > uploadTotalLimit) {
            return `Keep total uploads under ${formatBytes(uploadTotalLimit)}. Use a share link for larger folders or videos.`;
        }

        return '';
    }

    function renderExistingPresenceFields(prefix) {
        return `
            <div class="form-group starter-package-intake-span-2">
                <label class="starter-package-checkbox" for="${prefix}HasPresence">
                    <input type="checkbox" id="${prefix}HasPresence" name="hasOnlinePresence" value="yes">
                    <span>I already have a website, listing, or social profile you should review</span>
                </label>
            </div>
            <div class="starter-package-conditional starter-package-intake-span-2" id="${prefix}PresenceFields" hidden>
                <div class="starter-package-intake-grid starter-package-intake-grid--nested">
                    <div class="form-group">
                        <label for="${prefix}WebsiteOrProfile">Website or profile URL</label>
                        <input type="url" id="${prefix}WebsiteOrProfile" name="websiteOrProfile" placeholder="Optional website, store, or profile link" maxlength="255">
                    </div>
                    <div class="form-group">
                        <label for="${prefix}GoogleBusinessProfile">Google Business Profile URL</label>
                        <input type="url" id="${prefix}GoogleBusinessProfile" name="googleBusinessProfile" placeholder="Optional GBP link" maxlength="255">
                    </div>
                    <div class="form-group">
                        <label for="${prefix}FacebookUrl">Facebook URL</label>
                        <input type="url" id="${prefix}FacebookUrl" name="facebookUrl" placeholder="Optional Facebook link" maxlength="255">
                    </div>
                    <div class="form-group">
                        <label for="${prefix}InstagramUrl">Instagram URL</label>
                        <input type="url" id="${prefix}InstagramUrl" name="instagramUrl" placeholder="Optional Instagram link" maxlength="255">
                    </div>
                    <div class="form-group starter-package-intake-span-2">
                        <label for="${prefix}LinkedinUrl">LinkedIn or other profile URL</label>
                        <input type="url" id="${prefix}LinkedinUrl" name="linkedinUrl" placeholder="Optional LinkedIn or other profile link" maxlength="255">
                    </div>
                </div>
            </div>
        `;
    }

    function renderPaymentOptions(packageConfig) {
        if (!Array.isArray(packageConfig.paymentOptions) || packageConfig.paymentOptions.length === 0) {
            return '<input type="hidden" name="paymentOption" value="full">';
        }

        return `
            <div class="starter-package-payment-options">
                <div class="starter-package-payment-options-title">Payment option</div>
                ${packageConfig.paymentOptions.map((option, index) => `
                    <label class="starter-package-payment-option" for="starterPackagePaymentOption${index}">
                        <input
                            type="radio"
                            id="starterPackagePaymentOption${index}"
                            name="paymentOption"
                            value="${option.value}"
                            ${index === 0 ? 'checked' : ''}
                        >
                        <span>
                            <strong>${option.label}</strong>
                            <small>${option.help}</small>
                        </span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    function renderDynamicFields(packageConfig) {
        if (packageConfig.profile === 'website-local') {
            return `
                <div class="starter-package-intake-grid">
                    <div class="form-group starter-package-intake-span-2">
                        <label for="starterPackageProjectGoal">${packageConfig.goalLabel}</label>
                        <textarea id="starterPackageProjectGoal" name="projectDetails" placeholder="${packageConfig.goalPlaceholder}" maxlength="1500" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="starterPackagePrimaryZip">Primary ZIP code</label>
                        <input type="text" id="starterPackagePrimaryZip" name="primaryZip" placeholder="Example: 34695" maxlength="20" required>
                    </div>
                    <div class="form-group">
                        <label for="starterPackageServiceRadiusMiles">Approximate service radius</label>
                        <select id="starterPackageServiceRadiusMiles" name="serviceRadiusMiles" required>
                            <option value="">Choose one...</option>
                            <option value="5">About 5 miles</option>
                            <option value="10">About 10 miles</option>
                            <option value="15">About 15 miles</option>
                            <option value="25">About 25 miles</option>
                            <option value="40+">40+ miles or broader region</option>
                        </select>
                    </div>
                    <div class="form-group starter-package-intake-span-2">
                        <label for="starterPackagePrimaryService">Main service or offer</label>
                        <input type="text" id="starterPackagePrimaryService" name="primaryService" placeholder="Optional, but helpful" maxlength="120">
                    </div>
                </div>
                ${renderExistingPresenceFields('starterPackage')}
                ${renderPaymentOptions(packageConfig)}
            `;
        }

        if (packageConfig.profile === 'ecommerce') {
            return `
                <div class="starter-package-intake-grid">
                    <div class="form-group starter-package-intake-span-2">
                        <label for="starterPackageProjectGoal">${packageConfig.goalLabel}</label>
                        <textarea id="starterPackageProjectGoal" name="projectDetails" placeholder="${packageConfig.goalPlaceholder}" maxlength="1500" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="starterPackageApproxProductCount">Approximate product count</label>
                        <select id="starterPackageApproxProductCount" name="approxProductCount">
                            <option value="">Optional</option>
                            <option value="1-5">1 to 5 products</option>
                            <option value="6-10">6 to 10 products</option>
                            <option value="11-20">11 to 20 products</option>
                            <option value="21-50">21 to 50 products</option>
                            <option value="50+">50+ products</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="starterPackagePrimaryService">Main product category</label>
                        <input type="text" id="starterPackagePrimaryService" name="primaryService" placeholder="Optional" maxlength="120">
                    </div>
                </div>
                ${renderExistingPresenceFields('starterPackage')}
                ${renderPaymentOptions(packageConfig)}
            `;
        }

        if (packageConfig.profile === 'ops') {
            return `
                <div class="starter-package-intake-grid">
                    <div class="form-group starter-package-intake-span-2">
                        <label for="starterPackageProjectGoal">${packageConfig.goalLabel}</label>
                        <textarea id="starterPackageProjectGoal" name="projectDetails" placeholder="${packageConfig.goalPlaceholder}" maxlength="1500" required></textarea>
                    </div>
                    <div class="form-group starter-package-intake-span-2">
                        <label for="starterPackageCurrentSystem">Current spreadsheet, software, or process</label>
                        <input type="text" id="starterPackageCurrentSystem" name="currentSystem" placeholder="Optional, but helpful" maxlength="160">
                    </div>
                </div>
                ${renderPaymentOptions(packageConfig)}
            `;
        }

        if (packageConfig.profile === 'monthly') {
            return `
                <div class="starter-package-intake-grid">
                    <div class="form-group starter-package-intake-span-2">
                        <label for="starterPackageManagedPropertyUrl">Website or profile URL we will be working on</label>
                        <input type="url" id="starterPackageManagedPropertyUrl" name="managedPropertyUrl" placeholder="Website, GBP, or other main profile URL" maxlength="255" required>
                    </div>
                    <div class="form-group starter-package-intake-span-2">
                        <label for="starterPackageProjectGoal">${packageConfig.goalLabel}</label>
                        <textarea id="starterPackageProjectGoal" name="projectDetails" placeholder="${packageConfig.goalPlaceholder}" maxlength="1500" required></textarea>
                    </div>
                    <div class="form-group starter-package-intake-span-2">
                        <label for="starterPackageCurrentSystem">Other URLs or systems we should know about</label>
                        <input type="text" id="starterPackageCurrentSystem" name="currentSystem" placeholder="Optional additional profile or system notes" maxlength="160">
                    </div>
                </div>
                ${renderExistingPresenceFields('starterPackageMonthly')}
                ${renderPaymentOptions(packageConfig)}
            `;
        }

        return `
            <div class="starter-package-intake-grid">
                <div class="form-group starter-package-intake-span-2">
                    <label for="starterPackageProjectGoal">${packageConfig.goalLabel}</label>
                    <textarea id="starterPackageProjectGoal" name="projectDetails" placeholder="${packageConfig.goalPlaceholder}" maxlength="1500" required></textarea>
                </div>
            </div>
            ${renderExistingPresenceFields('starterPackage')}
            ${renderPaymentOptions(packageConfig)}
        `;
    }

    function renderAssurance(packageConfig) {
        const data = getAssuranceData(packageConfig);

        if (assuranceTitle) {
            assuranceTitle.textContent = data.title;
        }

        if (assuranceBody) {
            assuranceBody.textContent = data.body;
        }

        if (assuranceChips) {
            assuranceChips.innerHTML = data.chips
                .map((chip) => `<span class="starter-package-chip">${chip}</span>`)
                .join('');
        }
    }

    function setIntakeStatus(message, type) {
        if (!intakeStatus) {
            return;
        }

        if (!message) {
            intakeStatus.className = 'starter-package-intake-status';
            intakeStatus.innerHTML = '';
            return;
        }

        intakeStatus.className = `starter-package-intake-status is-visible is-${type || 'error'}`;
        intakeStatus.innerHTML = message;
    }

    function setIntakeSubmitting(isSubmitting) {
        if (!intakeSubmitButton || !intakeSubmitText || !intakeSubmitLoading) {
            return;
        }

        intakeSubmitButton.disabled = isSubmitting;
        intakeSubmitText.style.display = isSubmitting ? 'none' : 'block';
        intakeSubmitLoading.style.display = isSubmitting ? 'block' : 'none';
    }

    function setFollowupStatus(message, type) {
        if (!followupStatus) {
            return;
        }

        if (!message) {
            followupStatus.className = 'starter-package-followup-status';
            followupStatus.innerHTML = '';
            return;
        }

        followupStatus.className = `starter-package-followup-status is-visible is-${type || 'error'}`;
        followupStatus.innerHTML = message;
    }

    function setFollowupSubmitting(isSubmitting) {
        if (!followupSubmitButton || !followupSubmitText || !followupSubmitLoading) {
            return;
        }

        followupSubmitButton.disabled = isSubmitting;
        followupSubmitText.style.display = isSubmitting ? 'none' : 'block';
        followupSubmitLoading.style.display = isSubmitting ? 'block' : 'none';
    }

    function getSelectedPaymentOption() {
        if (!intakeForm) {
            return 'full';
        }

        const selected = intakeForm.querySelector('input[name="paymentOption"]:checked');
        return selected ? selected.value : 'full';
    }

    function getSelectedPaymentLabel(packageConfig) {
        if (!Array.isArray(packageConfig.paymentOptions) || packageConfig.paymentOptions.length === 0) {
            return packageConfig.price;
        }

        const selected = getSelectedPaymentOption();
        const selectedConfig = packageConfig.paymentOptions.find((option) => option.value === selected);
        return selectedConfig ? selectedConfig.label : packageConfig.price;
    }

    function updateCheckoutSummary(packageConfig) {
        const selectedPayment = getSelectedPaymentOption();
        const selectedPaymentConfig = Array.isArray(packageConfig.paymentOptions)
            ? packageConfig.paymentOptions.find((option) => option.value === selectedPayment)
            : null;

        if (configuratorLabel) {
            configuratorLabel.textContent = Array.isArray(packageConfig.paymentOptions) && packageConfig.paymentOptions.length > 0
                ? 'Checkout Path'
                : packageConfig.family === 'monthly'
                    ? 'Subscription Path'
                    : 'Secure Checkout';
        }

        if (configuratorTitle) {
            configuratorTitle.textContent = packageConfig.name;
        }

        if (configuratorPrice) {
            configuratorPrice.textContent = selectedPaymentConfig
                ? selectedPaymentConfig.label.replace(/^.*?-\s*/, '')
                : packageConfig.price;
        }

        if (configuratorCopy) {
            configuratorCopy.textContent = selectedPaymentConfig && selectedPayment === 'deposit'
                ? selectedPaymentConfig.help
                : packageConfig.family === 'monthly'
                    ? 'This starter form confirms the property and main priority before recurring Stripe checkout starts.'
                    : 'This starter form is just enough to get the project moving cleanly before secure Stripe checkout.';
        }

        if (configuratorMeta) {
            configuratorMeta.textContent = packageConfig.family === 'monthly'
                ? 'You can attach starter files now, but the main thing we need is the site or profile you want maintained.'
                : hasDepositOption(packageConfig)
                    ? 'If you choose a deposit, it is applied to the project total. You will still get a post-payment handoff for more files and references.'
                    : 'Starter files can be attached now, and larger folders, videos, or raw media can be sent by share link now or after payment.';
        }

        if (intakeSubmitText) {
            intakeSubmitText.textContent = selectedPaymentConfig
                ? `Continue to Checkout - ${selectedPaymentConfig.label.replace(/^.*?-\s*/, '')}`
                : packageConfig.family === 'monthly'
                    ? `Continue to Subscription Checkout - ${packageConfig.price}`
                    : `Continue to Checkout - ${packageConfig.price}`;
        }
    }

    function bindDynamicFieldBehavior(packageConfig) {
        const existingPresenceCheckbox = intakeForm ? intakeForm.querySelector('#starterPackageHasPresence, #starterPackageMonthlyHasPresence') : null;
        const existingPresenceFields = intakeForm ? intakeForm.querySelector('#starterPackagePresenceFields, #starterPackageMonthlyPresenceFields') : null;
        const paymentInputs = intakeForm ? Array.from(intakeForm.querySelectorAll('input[name="paymentOption"]')) : [];

        if (existingPresenceCheckbox && existingPresenceFields) {
            const toggleExistingPresence = function () {
                existingPresenceFields.hidden = !existingPresenceCheckbox.checked;
            };

            existingPresenceCheckbox.addEventListener('change', toggleExistingPresence);
            toggleExistingPresence();
        }

        paymentInputs.forEach((input) => {
            input.addEventListener('change', function () {
                updateCheckoutSummary(packageConfig);
            });
        });
    }

    function saveCheckoutDraft(packageKey) {
        if (!window.sessionStorage) {
            return;
        }

        try {
            window.sessionStorage.setItem(checkoutDraftStorageKey, JSON.stringify({
                packageKey,
                businessName: businessNameInput ? businessNameInput.value.trim() : '',
                contactName: contactNameInput ? contactNameInput.value.trim() : '',
                email: emailInput ? emailInput.value.trim() : '',
                phone: phoneInput ? phoneInput.value.trim() : '',
                scrollY: Math.round(window.scrollY || window.pageYOffset || 0)
            }));
        } catch (error) {
            console.warn('Unable to save checkout draft.', error);
        }
    }

    function getCheckoutDraft() {
        if (!window.sessionStorage) {
            return null;
        }

        try {
            const raw = window.sessionStorage.getItem(checkoutDraftStorageKey);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.warn('Unable to read checkout draft.', error);
            return null;
        }
    }

    function populateDraft(packageKey) {
        const draft = getCheckoutDraft();

        if (!draft || draft.packageKey !== packageKey) {
            return;
        }

        if (businessNameInput) {
            businessNameInput.value = draft.businessName || '';
        }

        if (contactNameInput) {
            contactNameInput.value = draft.contactName || '';
        }

        if (emailInput) {
            emailInput.value = draft.email || '';
        }

        if (phoneInput) {
            phoneInput.value = draft.phone || '';
        }
    }

    function restoreCheckoutScrollPosition() {
        const draft = getCheckoutDraft();

        if (!draft || !Number.isFinite(draft.scrollY)) {
            return;
        }

        window.scrollTo({ top: Math.max(0, draft.scrollY), behavior: 'auto' });
    }

    function serializeFormFields(formElement) {
        const payload = {};
        const formData = new FormData(formElement);

        formData.forEach((value, key) => {
            if (value instanceof File) {
                return;
            }

            if (typeof value === 'string' && value.trim() === '') {
                return;
            }

            payload[key] = value;
        });

        return payload;
    }

    function serializeFormForCheckout(formElement, options) {
        const config = options || {};
        const payload = serializeFormFields(formElement);

        payload.intakeUploadCompleted = Boolean(config.intakeUploadCompleted);
        payload.returnPath = window.location.pathname || '/pricing.html';
        return payload;
    }

    async function uploadPackageForm(payload, options) {
        const config = options || {};
        const requestHeaders = {
            Accept: 'application/json'
        };
        const requestBody = config.asJson ? JSON.stringify(payload) : payload;

        if (config.asJson) {
            requestHeaders['Content-Type'] = 'application/json';
        }

        const response = await fetch(getUploadEndpoint(), {
            method: 'POST',
            headers: requestHeaders,
            body: requestBody
        });

        const responsePayload = await response.json().catch(function () {
            return {};
        });

        if (!response.ok) {
            throw new Error(responsePayload.error || 'We could not send the package files right now.');
        }

        return responsePayload;
    }

    function openIntake(packageKey, triggerElement) {
        if (!intakeOverlay || !intakeForm || !dynamicFields) {
            return;
        }

        const packageConfig = getPackageDetails(packageKey);
        activePackageKey = packageKey;
        lastTrigger = triggerElement || null;

        intakeForm.reset();
        setIntakeStatus('');

        if (intakePackageKeyInput) {
            intakePackageKeyInput.value = packageKey;
        }

        if (intakePackageNameInput) {
            intakePackageNameInput.value = packageConfig.name;
        }

        if (intakePackagePriceInput) {
            intakePackagePriceInput.value = packageConfig.price;
        }

        if (intakePackageLabel) {
            intakePackageLabel.textContent = `${packageConfig.name} - ${packageConfig.price}`;
        }

        renderAssurance(packageConfig);
        dynamicFields.innerHTML = renderDynamicFields(packageConfig);
        updateCheckoutSummary(packageConfig);
        bindDynamicFieldBehavior(packageConfig);
        populateDraft(packageKey);
        updateFileList(fileList, logoFileInput, referenceFilesInput);

        if (intakeHelper) {
            intakeHelper.innerHTML = 'Keep each file under 2 MB and total uploads under 4 MB. Small media and document files are fine here. For larger folders, videos, or raw media, use a share link now. You will also get a post-payment handoff for anything else.';
        }

        intakeOverlay.classList.add('is-visible');
        intakeOverlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('package-intake-open');

        window.requestAnimationFrame(function () {
            if (businessNameInput) {
                businessNameInput.focus();
            } else if (intakeDialog) {
                intakeDialog.focus();
            }
        });
    }

    function closeIntake(forceClose) {
        if (!intakeOverlay || !intakeOverlay.classList.contains('is-visible') || (!forceClose && intakeSubmitButton && intakeSubmitButton.disabled)) {
            return;
        }

        intakeOverlay.classList.remove('is-visible');
        intakeOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('package-intake-open');
        setIntakeStatus('');

        if (lastTrigger && typeof lastTrigger.focus === 'function') {
            lastTrigger.focus();
        }
    }

    function syncModalState() {
        const hasOpenModal = Boolean(
            (successOverlay && successOverlay.classList.contains('is-visible')) ||
            (followupOverlay && followupOverlay.classList.contains('is-visible'))
        );

        document.body.classList.toggle('starter-package-modal-open', hasOpenModal);
    }

    function openSuccessOverlay(packageKey) {
        if (!successOverlay) {
            return;
        }

        const packageConfig = getPackageDetails(packageKey);
        activePurchaseReturnPackageKey = packageKey;

        if (successPackageLabel) {
            successPackageLabel.textContent = `${packageConfig.name} - ${packageConfig.price}`;
        }

        if (successCopy) {
            successCopy.textContent = `Payment for ${packageConfig.name} was received successfully. Click OK to continue to the final handoff for any remaining files, links, or notes.`;
        }

        successOverlay.classList.add('is-visible');
        successOverlay.setAttribute('aria-hidden', 'false');
        syncModalState();

        window.requestAnimationFrame(function () {
            if (successConfirmButton) {
                successConfirmButton.focus();
            } else if (successDialog) {
                successDialog.focus();
            }
        });
    }

    function closeSuccessOverlay() {
        if (!successOverlay || !successOverlay.classList.contains('is-visible')) {
            return;
        }

        successOverlay.classList.remove('is-visible');
        successOverlay.setAttribute('aria-hidden', 'true');
        syncModalState();
    }

    function openFollowupOverlay(packageKey) {
        if (!followupOverlay || !followupForm) {
            return;
        }

        const packageConfig = getPackageDetails(packageKey);
        const draft = getCheckoutDraft();

        followupForm.reset();
        setFollowupStatus('');

        if (followupPackageLabel) {
            followupPackageLabel.textContent = `${packageConfig.name} - ${packageConfig.price}`;
        }

        if (followupPackageKeyInput) {
            followupPackageKeyInput.value = packageKey;
        }

        if (followupPackageNameInput) {
            followupPackageNameInput.value = packageConfig.name;
        }

        if (followupPackagePriceInput) {
            followupPackagePriceInput.value = packageConfig.price;
        }

        if (followupSubmissionStageInput) {
            followupSubmissionStageInput.value = 'followup';
        }

        if (followupSubmissionTypeInput) {
            followupSubmissionTypeInput.value = 'starter-package-post-payment-handoff';
        }

        if (followupSubjectInput) {
            followupSubjectInput.value = `Starter Package Handoff: ${packageConfig.name}`;
        }

        if (draft && (!draft.packageKey || draft.packageKey === packageKey)) {
            if (followupBusinessNameInput) {
                followupBusinessNameInput.value = draft.businessName || '';
            }
            if (followupContactNameInput) {
                followupContactNameInput.value = draft.contactName || '';
            }
            if (followupEmailInput) {
                followupEmailInput.value = draft.email || '';
            }
        }

        updateFileList(followupFileList, followupLogoFileInput, followupAttachmentsInput);

        followupOverlay.classList.add('is-visible');
        followupOverlay.setAttribute('aria-hidden', 'false');
        syncModalState();

        window.requestAnimationFrame(function () {
            if (followupContactNameInput) {
                followupContactNameInput.focus();
            } else if (followupDialog) {
                followupDialog.focus();
            }
        });
    }

    function closeFollowupOverlay(forceClose) {
        if (!followupOverlay || !followupOverlay.classList.contains('is-visible') || (!forceClose && followupSubmitButton && followupSubmitButton.disabled)) {
            return;
        }

        followupOverlay.classList.remove('is-visible');
        followupOverlay.setAttribute('aria-hidden', 'true');
        syncModalState();
    }

    function proceedToFollowupOverlay() {
        const packageKey = activePurchaseReturnPackageKey || (followupPackageKeyInput ? followupPackageKeyInput.value : activePackageKey);
        closeSuccessOverlay();
        openFollowupOverlay(packageKey);
    }

    async function submitPackageIntake() {
        if (!intakeForm) {
            return;
        }

        const packageConfig = getPackageDetails(activePackageKey);
        const hasPrecheckoutFiles = Boolean(
            (logoFileInput && logoFileInput.files && logoFileInput.files.length) ||
            (referenceFilesInput && referenceFilesInput.files && referenceFilesInput.files.length)
        );
        const fileValidationMessage = hasPrecheckoutFiles
            ? validateSelectedFiles(logoFileInput, referenceFilesInput)
            : '';

        if (!intakeForm.reportValidity()) {
            return;
        }

        if (fileValidationMessage) {
            setIntakeStatus(fileValidationMessage, 'error');
            return;
        }

        const uploadFormData = new FormData(intakeForm);
        uploadFormData.set('submissionStage', 'precheckout');
        uploadFormData.set('submissionType', 'starter-package-precheckout-intake');
        uploadFormData.set('packageName', packageConfig.name);
        uploadFormData.set('packagePrice', packageConfig.price);
        uploadFormData.set('_replyto', emailInput ? emailInput.value.trim() : '');
        uploadFormData.set('_subject', `Starter Package Intake: ${packageConfig.name}`);
        uploadFormData.set('serviceType', `Starter Package Checkout - ${packageConfig.name}`);
        uploadFormData.set('budget', getSelectedPaymentLabel(packageConfig));
        uploadFormData.set('timeline', 'Submitted from pricing starter form');

        setIntakeSubmitting(true);
        setIntakeStatus('');

        try {
            let intakeUploadCompleted = false;

            if (hasPrecheckoutFiles) {
                await uploadPackageForm(uploadFormData);
                intakeUploadCompleted = true;
            }

            const checkoutPayload = serializeFormForCheckout(intakeForm, {
                intakeUploadCompleted
            });
            const response = await fetch(getCheckoutEndpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(checkoutPayload)
            });
            const payload = await response.json().catch(function () {
                return {};
            });

            if (!response.ok || !payload.url) {
                const error = new Error(payload.error || 'Unable to start checkout right now.');
                throw error;
            }

            saveCheckoutDraft(activePackageKey);
            window.location.href = payload.url;
        } catch (error) {
            console.error('Pricing package checkout error:', error);
            setIntakeStatus(
                `${error.message || 'We could not start checkout right now.'} If needed, email <a href="mailto:${intakeSupportEmail}">${intakeSupportEmail}</a> with a share link and we will help you manually.`,
                'error'
            );
        } finally {
            setIntakeSubmitting(false);
        }
    }

    async function submitFollowup() {
        if (!followupForm) {
            return;
        }

        const fileValidationMessage = validateSelectedFiles(followupLogoFileInput, followupAttachmentsInput);

        if (!followupForm.reportValidity()) {
            return;
        }

        if (fileValidationMessage) {
            setFollowupStatus(fileValidationMessage, 'error');
            return;
        }

        const hasDetails = Boolean(followupDetailsInput && followupDetailsInput.value.trim());
        const hasShareLink = Boolean(followupAssetLinkInput && followupAssetLinkInput.value.trim());
        const hasFiles = Boolean(
            (followupLogoFileInput && followupLogoFileInput.files && followupLogoFileInput.files.length) ||
            (followupAttachmentsInput && followupAttachmentsInput.files && followupAttachmentsInput.files.length)
        );

        if (!hasDetails && !hasShareLink && !hasFiles) {
            setFollowupStatus('Add notes, a share link, or at least one file before sending the handoff.', 'error');
            return;
        }

        const uploadFormData = new FormData(followupForm);
        uploadFormData.set('submissionStage', 'followup');
        uploadFormData.set('submissionType', 'starter-package-post-payment-handoff');
        uploadFormData.set('_replyto', followupEmailInput ? followupEmailInput.value.trim() : '');

        setFollowupSubmitting(true);
        setFollowupStatus('');

        try {
            if (hasFiles) {
                await uploadPackageForm(uploadFormData);
            } else {
                const followupPayload = serializeFormFields(followupForm);
                await uploadPackageForm(followupPayload, { asJson: true });
            }
            setFollowupStatus(`Your additional files and notes for ${followupPackageNameInput ? followupPackageNameInput.value : 'this package'} were sent. If you still need to share a large folder or video, email <a href="mailto:${intakeSupportEmail}">${intakeSupportEmail}</a> with the link.`, 'success');
            updateFileList(followupFileList, followupLogoFileInput, followupAttachmentsInput);
        } catch (error) {
            console.error('Pricing package follow-up error:', error);
            setFollowupStatus(
                `${error.message || 'We could not send the handoff right now.'} You can still email <a href="mailto:${intakeSupportEmail}">${intakeSupportEmail}</a> with a share link.`,
                'error'
            );
        } finally {
            setFollowupSubmitting(false);
        }
    }

    function schedulePurchaseReturnExperience(packageKey) {
        const run = function () {
            restoreCheckoutScrollPosition();
            window.setTimeout(function () {
                openSuccessOverlay(packageKey);
            }, 150);
        };

        if (document.readyState === 'complete') {
            run();
            return;
        }

        window.addEventListener('load', run, { once: true });
    }

    function scheduleCheckoutCancelled(packageKey) {
        const run = function () {
            restoreCheckoutScrollPosition();
            openIntake(packageKey, null);
            setIntakeStatus('Checkout was cancelled. Your starter details were kept locally in this browser so you can pick up where you left off.', 'warning');
        };

        if (document.readyState === 'complete') {
            run();
            return;
        }

        window.addEventListener('load', run, { once: true });
    }

    pricingCtas.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const href = link.getAttribute('href') || '';
            const url = new URL(href, window.location.origin);
            const packageKey = url.searchParams.get('openPackage');

            if (!packageKey || !packageCatalog[packageKey]) {
                return;
            }

            openIntake(packageKey, link);
        });
    });

    if (logoFileInput) {
        logoFileInput.addEventListener('change', function () {
            updateFileList(fileList, logoFileInput, referenceFilesInput);
        });
    }

    if (referenceFilesInput) {
        referenceFilesInput.addEventListener('change', function () {
            updateFileList(fileList, logoFileInput, referenceFilesInput);
        });
    }

    if (followupLogoFileInput) {
        followupLogoFileInput.addEventListener('change', function () {
            updateFileList(followupFileList, followupLogoFileInput, followupAttachmentsInput);
        });
    }

    if (followupAttachmentsInput) {
        followupAttachmentsInput.addEventListener('change', function () {
            updateFileList(followupFileList, followupLogoFileInput, followupAttachmentsInput);
        });
    }

    if (intakeForm) {
        intakeForm.addEventListener('submit', function (event) {
            event.preventDefault();
            submitPackageIntake();
        });
    }

    if (followupForm) {
        followupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            submitFollowup();
        });
    }

    if (intakeCloseButton) {
        intakeCloseButton.addEventListener('click', function () {
            closeIntake();
        });
    }

    if (intakeCancelButton) {
        intakeCancelButton.addEventListener('click', function () {
            closeIntake();
        });
    }

    if (intakeOverlay) {
        intakeOverlay.addEventListener('click', function (event) {
            if (event.target === intakeOverlay) {
                closeIntake();
            }
        });
    }

    if (successConfirmButton) {
        successConfirmButton.addEventListener('click', proceedToFollowupOverlay);
    }

    if (successCloseButton) {
        successCloseButton.addEventListener('click', proceedToFollowupOverlay);
    }

    if (successOverlay) {
        successOverlay.addEventListener('click', function (event) {
            if (event.target === successOverlay) {
                proceedToFollowupOverlay();
            }
        });
    }

    if (followupCloseButton) {
        followupCloseButton.addEventListener('click', function () {
            closeFollowupOverlay();
        });
    }

    if (followupOverlay) {
        followupOverlay.addEventListener('click', function (event) {
            if (event.target === followupOverlay) {
                closeFollowupOverlay();
            }
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') {
            return;
        }

        if (successOverlay && successOverlay.classList.contains('is-visible')) {
            proceedToFollowupOverlay();
            return;
        }

        if (followupOverlay && followupOverlay.classList.contains('is-visible')) {
            closeFollowupOverlay();
            return;
        }

        closeIntake();
    });

    const params = new URLSearchParams(window.location.search);
    const openPackageKey = params.get('openPackage');
    const purchaseState = params.get('purchase');
    const returnPackageKey = params.get('package');

    if (openPackageKey && packageCatalog[openPackageKey]) {
        openIntake(openPackageKey, null);
    }

    if (purchaseState === 'success' && returnPackageKey && packageCatalog[returnPackageKey]) {
        schedulePurchaseReturnExperience(returnPackageKey);
    }

    if (purchaseState === 'cancelled' && returnPackageKey && packageCatalog[returnPackageKey]) {
        scheduleCheckoutCancelled(returnPackageKey);
    }
    window.__pricingPackageCheckoutReady = true;
    } catch (error) {
        console.error('Pricing package checkout script failed:', error);
        window.__pricingPackageCheckoutError = error && error.message ? error.message : String(error);
    }
})();
