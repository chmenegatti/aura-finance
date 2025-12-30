import { motion } from "framer-motion";
import { 
  TrendingUp, 
  PieChart, 
  Calendar, 
  FileText, 
  LayoutDashboard,
  Shield
} from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Controle de Entradas e Saídas",
    description: "Registre todas as suas movimentações financeiras de forma rápida e organizada.",
    color: "text-income",
    bg: "bg-income/10"
  },
  {
    icon: PieChart,
    title: "Gráficos Interativos",
    description: "Visualize seus gastos por categoria com gráficos claros e intuitivos.",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    icon: Calendar,
    title: "Gastos Recorrentes",
    description: "Organize financiamentos, empréstimos e assinaturas em um só lugar.",
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    icon: FileText,
    title: "Comprovantes Organizados",
    description: "Faça upload e organize todos os seus comprovantes de despesas.",
    color: "text-warning",
    bg: "bg-warning/10"
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Inteligente",
    description: "Tenha uma visão completa da sua saúde financeira em tempo real.",
    color: "text-info",
    bg: "bg-info/10"
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Seus dados financeiros protegidos com criptografia de ponta.",
    color: "text-income",
    bg: "bg-income/10"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export const BenefitsSection = () => {
  return (
    <section id="funcionalidades" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            Benefícios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tudo que você precisa para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              organizar suas finanças
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas poderosas e intuitivas para você ter controle total do seu dinheiro.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-soft-lg"
            >
              <div className={`w-14 h-14 rounded-xl ${benefit.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
