import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import colors from '../theme/colors';

/**
 * Generates an HTML template for the modern invoice
 * @param {Object} orderData - The order details
 * @returns {string} HTML string
 */
export const generateInvoiceHtml = (orderData) => {
    const {
        id = 'N/A',
        customerName,
        email,
        phone,
        shippingAddress,
        items,
        subtotal,
        discount,
        total,
        paymentMethod,
        tier,
        createdAt
    } = orderData;

    const date = createdAt ? new Date(createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }) : new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const itemsHtml = items.map(item => `
        <tr class="item-row">
            <td>
                <span class="brand">${item.brand}</span><br>
                <span class="name">${item.name}</span>
            </td>
            <td style="text-align: center;">1</td>
            <td style="text-align: right;">${item.price.toFixed(2)} €</td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture Ayla #${id.substring(0, 8)}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: ${colors.primary};
                --accent: ${colors.accent};
                --charcoal: ${colors.charcoal};
                --light-gray: #f8f9fa;
                --border: #e9ecef;
            }
            body {
                font-family: 'Inter', sans-serif;
                color: var(--charcoal);
                margin: 0;
                padding: 40px;
                line-height: 1.6;
                background-color: #fff;
            }
            .container {
                max-width: 800px;
                margin: auto;
            }
            header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 60px;
            }
            .logo-section .logo {
                font-size: 38px;
                font-weight: 800;
                color: var(--primary);
                letter-spacing: 4px;
                margin-bottom: 5px;
            }
            .logo-section .tagline {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: #999;
            }
            .invoice-meta {
                text-align: right;
            }
            .invoice-meta h1 {
                font-size: 24px;
                font-weight: 700;
                margin: 0 0 10px 0;
                color: var(--accent);
            }
            .invoice-meta p {
                margin: 0;
                font-size: 14px;
                color: #666;
            }
            .billing-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-bottom: 50px;
            }
            .billing-col h3 {
                font-size: 13px;
                text-transform: uppercase;
                color: #aaa;
                margin-bottom: 15px;
                border-bottom: 1px solid var(--border);
                padding-bottom: 8px;
            }
            .billing-col p {
                font-size: 15px;
                margin: 0;
            }
            .billing-col strong {
                font-size: 17px;
                display: block;
                margin-bottom: 5px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 40px 0;
            }
            table th {
                text-align: left;
                padding: 15px 10px;
                font-size: 13px;
                text-transform: uppercase;
                color: #999;
                border-bottom: 1px solid var(--border);
            }
            .item-row td {
                padding: 20px 10px;
                border-bottom: 1px solid var(--light-gray);
                font-size: 15px;
            }
            .item-row .brand {
                font-weight: 700;
                color: var(--accent);
                font-size: 16px;
            }
            .summary-section {
                width: 300px;
                margin-left: auto;
            }
            .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                font-size: 15px;
            }
            .total-row {
                margin-top: 15px;
                padding-top: 20px;
                border-top: 2px solid var(--primary);
                font-size: 22px;
                font-weight: 800;
                color: var(--accent);
            }
            footer {
                margin-top: 80px;
                padding-top: 30px;
                border-top: 1px solid var(--border);
                text-align: center;
                font-size: 13px;
                color: #bbb;
            }
            .watermark {
                position: fixed;
                bottom: 20px;
                right: 20px;
                font-size: 60px;
                color: rgba(0,0,0,0.03);
                font-weight: 900;
                transform: rotate(-15deg);
                z-index: -1;
            }
        </style>
    </head>
    <body>
        <div class="watermark">OFFICIEL</div>
        <div class="container">
            <header>
                <div class="logo-section">
                    <div class="logo">AYLA</div>
                    <div class="tagline">Beauty Expert Selection</div>
                </div>
                <div class="invoice-meta">
                    <h1>FACTURATION</h1>
                    <p>Facture n° ${id.substring(0, 8).toUpperCase()}</p>
                    <p>Date : ${date}</p>
                </div>
            </header>

            <div class="billing-section">
                <div class="billing-col">
                    <h3>Facturé à</h3>
                    <p>
                        <strong>${customerName}</strong>
                        ${shippingAddress.address}<br>
                        ${shippingAddress.postalCode} ${shippingAddress.city}<br>
                        ${email}<br>
                        ${phone}
                    </p>
                </div>
                <div class="billing-col">
                    <h3>Méthode de Paiement</h3>
                    <p>
                        <strong>${paymentMethod === 'Cash on Delivery' ? 'Espèces' : paymentMethod}</strong>
                        Paiement à la réception<br>
                        Statut : Confirmé
                    </p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 60%;">Description</th>
                        <th style="text-align: center;">Qté</th>
                        <th style="text-align: right;">Prix Unitaire</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div class="summary-section">
                <div class="summary-row">
                    <span>Sous-total</span>
                    <span>${(subtotal || total).toFixed(2)} €</span>
                </div>
                ${discount > 0 ? `
                <div class="summary-row" style="color: var(--accent); font-weight: 600;">
                    <span>Remise Fidélité (${tier || 'Ayla'})</span>
                    <span>-${discount.toFixed(2)} €</span>
                </div>
                ` : ''}
                <div class="summary-row">
                    <span>Livraison</span>
                    <span>0,00 €</span>
                </div>
                <div class="summary-row total-row">
                    <span>TOTAL</span>
                    <span>${total.toFixed(2)} €</span>
                </div>
            </div>

            <footer>
                <p>Merci pour votre commande chez AYLA. Nous espérons vous revoir bientôt.</p>
                <p>AYLA Beauty - www.ayla.com - Siret: 123 456 789 00010</p>
            </footer>
        </div>
    </body>
    </html>
    `;
};

/**
 * Creates and shares the PDF invoice
 * @param {Object} orderData - The order details
 */
export const generateAndShareInvoice = async (orderData) => {
    try {
        const html = generateInvoiceHtml(orderData);

        const { uri } = await Print.printToFileAsync({
            html,
            base64: false
        });

        console.log('PDF generated at:', uri);

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Télécharger votre facture Ayla',
                UTI: 'com.adobe.pdf'
            });
        } else {
            await Print.printAsync({ html });
        }

        return { uri, html };
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};

export default {
    generateInvoiceHtml,
    generateAndShareInvoice
};
