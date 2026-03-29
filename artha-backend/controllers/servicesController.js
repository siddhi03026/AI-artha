const Service = require('../models/Service');
const ServiceInteraction = require('../models/ServiceInteraction');

const DEFAULT_USER_ID = 'demo-user-123';

const defaultCatalog = [
  {
    serviceId: 'loan-smart-personal',
    category: 'loan',
    name: 'Smart Personal Loan',
    shortDescription: 'Low-interest rates from 8.5% p.a.',
    details: 'Fast approval, flexible tenures, and low processing fee for salaried users.',
    ctaLabel: 'Explore',
    metadata: { apr: '8.5% - 12.5%' },
  },
  {
    serviceId: 'insurance-health-shield',
    category: 'insurance',
    name: 'Health Shield Plus',
    shortDescription: 'Coverage starting at Rs 500/month',
    details: 'Cashless network support with top-up and family floater options.',
    ctaLabel: 'Compare',
    metadata: { coverage: 'INR 10L - INR 50L' },
  },
  {
    serviceId: 'creditcard-artha-rewards',
    category: 'creditCard',
    name: 'Artha Rewards Card',
    shortDescription: 'Cashback and reward cards tailored for you',
    details: 'High rewards on essentials and utility bills with low joining fee plans.',
    ctaLabel: 'Apply',
    metadata: { benefits: '5% on essentials, 2% on travel' },
  },
  {
    serviceId: 'mf-goal-sip',
    category: 'mutualFund',
    name: 'Goal SIP Plan',
    shortDescription: 'Curated SIP plans for your goals',
    details: 'Diversified mutual fund baskets selected by risk profile and time horizon.',
    ctaLabel: 'Invest',
    metadata: { returns: 'Historical 11% - 14% CAGR' },
  },
];

const ensureCatalogSeeded = async () => {
  const count = await Service.countDocuments({});
  if (count > 0) return;
  await Service.insertMany(defaultCatalog);
};

const toClientShape = (service) => {
  const highlight =
    service.metadata?.apr ||
    service.metadata?.coverage ||
    service.metadata?.benefits ||
    service.metadata?.returns ||
    '';

  return {
    serviceId: service.serviceId,
    category: service.category,
    name: service.name,
    suitability: service.shortDescription,
    details: service.details,
    ctaLabel: service.ctaLabel,
    highlight,
  };
};

const groupServices = (services) => {
  const grouped = {
    loans: [],
    insurance: [],
    creditCards: [],
    mutualFunds: [],
  };

  services.forEach((service) => {
    if (service.category === 'loan') grouped.loans.push(toClientShape(service));
    if (service.category === 'insurance') grouped.insurance.push(toClientShape(service));
    if (service.category === 'creditCard') grouped.creditCards.push(toClientShape(service));
    if (service.category === 'mutualFund') grouped.mutualFunds.push(toClientShape(service));
  });

  return grouped;
};

const getMarketplaceServices = async (_req, res) => {
  try {
    await ensureCatalogSeeded();

    const services = await Service.find({ isActive: true })
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json(groupServices(services));
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch marketplace services',
      error: error.message,
    });
  }
};

const trackServiceInteraction = async (req, res) => {
  try {
    const { serviceId, action = 'explore' } = req.body || {};

    if (!serviceId) {
      return res.status(400).json({ message: 'serviceId is required' });
    }

    const exists = await Service.exists({ serviceId, isActive: true });
    if (!exists) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await ServiceInteraction.create({
      userId: DEFAULT_USER_ID,
      serviceId,
      action,
    });

    return res.status(201).json({
      message: 'Interaction recorded',
      serviceId,
      action,
      recordedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to track service interaction',
      error: error.message,
    });
  }
};

module.exports = {
  getMarketplaceServices,
  trackServiceInteraction,
};
