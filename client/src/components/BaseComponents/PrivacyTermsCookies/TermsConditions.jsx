
const Owner = import.meta.env.VITE_OWNER_NAME;
const OwnerEmail = import.meta.env.VITE_OWNEREMAIL;
const AddressLine1 = import.meta.env.VITE_ADDRESS_LINE1;
const AddressLine2 = import.meta.env.VITE_ADDRESS_LINE2;
const AddressLine3 = import.meta.env.VITE_ADDRESS_LINE3;
const PhoneLink = import.meta.env.VITE_LINK_PHONE;
const PhoneDisplay = import.meta.env.VITE_DISPLAY_PHONE;
const RefundDays = import.meta.env.VITE_REFUND_DAYS
const ContactEmail = import.meta.env.VITE_CONTACT_EMAIL
const State = import.meta.env.VITE_STATE

import './privacyTermsCookies.css'


export default function TermsConditions() {

    return(
        <>
        <div className="terms_header">
            <p>Effective date: 1st day of June, 2026</p>
            <p>These terms and conditions (the "Terms and Conditions") govern the use of noveleshelf.com (the "Site"). This Site is owned and operated by {Owner}. This Site is a service.</p>
            <p>By using this Site, you indicate that you have read and understand these Terms and Conditions and agree to abide by them at all times.</p>
        </div>
        <div className="terms_content">
            <div className="section">
                <h3>Intellectual Property</h3>
                <p>All content published and made available on our Site is the property of {Owner} and the Site's creators. This includes, but is not limited to images, text, logos, documents, downloadable files and anything that contributes to the composition of our Site.</p>
            </div>
            <div className="section">
                <h3>Age Restrictions</h3>
                <p>The minimum age to use our Site is 18 years old. By using this Site, users agree that they are over 18 years old.  We do not assume any responsibility for false statements about age.</p>
            </div>
            <div className="section">
                <h3>Acceptable Use</h3>
                <p>As a user of our Site, you agree to use our Site legally, not to use our Site for illegal purposes, and not to:</p>
                <ul>
                    <li>Harass or mistreat other users of our Site;</li>
                    <li>Violate the rights of other users of our Site;</li>
                    <li>Violate the intellectual property rights of the Site owners or any third party to the Site;</li>
                    <li>Hack into the account of another user of the Site;</li>
                    <li>Act in any way that could be considered fraudulent; or</li>
                    <li>Post any material that may be deemed inappropriate or offensive.</li>
                </ul>
                <p>If we believe you are using our Site illegally or in a manner that violates these Terms and Conditions, we reserve the right to limit, suspend or terminate your access to our Site. We also reserve the right to take any legal steps necessary to prevent you from accessing our Site.</p>
            </div>
            <div className="section">
                <h3>User Contributions</h3>
                <p>Users may post the following information/content on our Site:</p>
                <ul>
                    <li>Items for Sale;</li>
                    <li>Photos; and</li>
                    <li>Public comments.</li>
                </ul>
                <p>By posting publicly on our Site, you agree not to act illegally or violate these Terms and Conditions.</p>
            </div>
            <div className="section">
                <h3>Accounts</h3>
                <p>When you create an account on our Site, you agree to the following:</p>
                <ol>
                    <li>You are solely responsible for your account and the security and privacy of your account, including passwords or sensitive information attached to that account; and</li>
                    <li>All personal information you provide to us through your account is up to date, accurate, and truthful and that you will update your personal information if it changes.</li>
                </ol>
                <p>We reserve the right to suspend or terminate your account if you are using our Site illegally or if you violate these Terms and Conditions.</p>
            </div>
            <div className="section">
                <h3>Sale of Goods</h3>
                <p>These Terms and Conditions govern the sale of goods available on our Site.</p>
                <p>The following goods are available on our Site:</p>
                <ul>
                    <li>Digital content, including access to book chapters, and virtual currency (Quills) used to unlock content on our platform.</li>
                </ul>
                <p>These Terms and Conditions apply to all the goods that are displayed on our Site at the time you access it. All information, descriptions, or images that we provide about our goods are as accurate as possible.  However, we are not legally bound by such information, descriptions, or images as we cannot guarantee the accuracy of all goods we provide.  You agree to purchase good from our Site at your own risk.</p>
                <p>We reserve the right to modify, reject or cancel your order whenever it becomes necessary. If we cancel your order and have already processed your payment, we will give you a refund equal to the amount you paid.  You agree that it is your responsibility to monitor your payment instrument to verify receipt of any refund.</p>
            </div>
            <div className="section">
                <h3>User Goods and Services</h3>
                <p>Our Site allows users to sell goods and services.  We do not assume any responsibility for the goods and services users sell on our Site.  We cannot guarantee the quality or accuracy of any goods and services sold by users on our Site.  However, if we are made area that a user is violating these Terms and Conditions, we reserve the right to suspend or prohibit the user from selling goods and services on our Site.</p>
            </div>
            <div className="section">
                <h3>Payments</h3>
                <p>We accept the following payment methods on our Site:</p>
                <ul>
                    <li>Credit Card;</li>
                    <li>Stripe; and</li>
                    <li>Debit</li>
                </ul>
                <p>When you provide us with your payment information, you authorize our use of and access to the payment instrument you have chosen to use.  By providing us with your payment information, you authorize us to charge the amount due to this payment instrument.</p>
                <p>If we believe your payment has violated any law or these Terms and Conditions, we reserve the right to cancel or reverse your transaction.</p>
            </div>
            <div className="section">
                <h3>Refunds</h3>
                <p>Refunds for Goods</p>
                <p>Refund requests must be made within {RefundDays} days after receipt of your goods.</p>
                <p>We accept refund requests for goods sold on your Site for any of the following reasons:</p>
                <ul>
                    <li>Refunds may be granted at our discretion  under certain conditions, such as technical errors or unauthorized transactions.  Please contact us as {ContactEmail} to request a refund</li>
                </ul>
                <p>Refunds to not apply to the following goods:</p>
                <ul>
                    <li>Digital content or virtual currency that has already been used, redeemed, or accessed (such as unlocked chapters) cannot be refunded.</li>
                </ul>
            </div>
            <div className="section">
                <h3>Consumer Protection Law</h3>
                <p>Where any consumer protection legislation in your jurisdiction applies and cannot be excluded, these Terms and Conditions will not limit your legal rights and remedies under that legislation.  These Terms and Conditions will be read subject to the mandatory provisions of that legislation.  If there is a conflict between these Terms and Conditions and that legislation, the mandatory provisions of the legislation will apply.</p>
            </div>
            <div className="section">
                <h3>Links to Other Websites</h3>
                <p>Our Site contains links to third party websites or services that we do not own or control. We are not responsible for the content, policies, or practices of any third party website or service linked to on our Site. It is your responsibility to read the terms and conditions and privacy policies of these third party websites before using these sites.</p>
            </div>
            <div className="section">
                <h3>Limitation of Liability</h3>
                <p>{Owner} and our directors, officers, agents, employees, subsidiaries, and affiliates will not be liable for any actions, claims, losses, damages, liabilities and expenses including legal fees from your use of the Site.</p>
            </div>
            <div className="section">
                <h3>Indemnity</h3>
                <p>Except where prohibited by law, by using this Site you indemnify and hold harmless {Owner} and our directors, officers, agents, employees, subsidiaries, and affiliates from any actions, claims, losses, damages, liabilities and expenses including legal fees arising out of your use of our Site or your violation of these Terms and Conditions.</p>
            </div>
            <div className="section">
                <h3>Applicable Law</h3>
                <p>These Terms and Conditions are governed by the laws of the {State}.</p>
            </div>
            <div className="section">
                <h3>Severability</h3>
                <p>If at any time any of the provisions set forth in these Terms and Conditions are found to be inconsistent or invalid under applicable laws, those provisions will be deemed void and will be removed from these Terms and Conditions. All other provisions will not be affected by the removal and the rest of these Terms and Conditions will still be considered valid.</p>
            </div>
            <div className="section">
                <h3>Changes</h3>
                <p>These Terms and Conditions may be amended from time to time in order to maintain compliance with the law and to reflect any changes to the way we operate our Site and the way we expect users to behave on our Site. We will notify users by email of changes to these Terms and Conditions or post a notice on our Site.</p>
            </div>
            <div className="section">
                <h3>Contact Details</h3>
                <p>Please contact us if you have any questions or concerns. Our contact details are as follows:</p>
                <address>
                <a href={`mailto:${ContactEmail}?subject=Regarding%20Terms%20and%20Conditions...`}>{OwnerEmail}</a>
                <a href={PhoneLink}>{PhoneDisplay}</a>
                <p>{AddressLine1}</p>
                <p>{AddressLine2}</p>
                <p>{AddressLine3}</p>
            </address>
            <p>You can also contact us through the feedback form available on our Site.</p>
            </div>
        </div>
        </>
    )
}