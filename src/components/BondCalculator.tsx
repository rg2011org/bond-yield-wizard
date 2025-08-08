import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp } from "lucide-react";

interface BondData {
  nominalValue: string;
  currentValue: string;
  expirationYear: string;
  yearlyInterestRate: string;
}

interface CalculationResult {
  compoundRate: number;
  totalInterestPayments: number;
  totalReturn: number;
  yearsRemaining: number;
}

const BondCalculator = () => {
  const [bondData, setBondData] = useState<BondData>({
    nominalValue: "",
    currentValue: "",
    expirationYear: "",
    yearlyInterestRate: "",
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateCompoundRate = () => {
    const nominal = parseFloat(bondData.nominalValue);
    const current = parseFloat(bondData.currentValue);
    const expYear = parseInt(bondData.expirationYear);
    const interestRate = parseFloat(bondData.yearlyInterestRate) / 100;

    if (isNaN(nominal) || isNaN(current) || isNaN(expYear) || isNaN(interestRate)) {
      setResult(null);
      return;
    }

    const currentYear = new Date().getFullYear();
    const yearsRemaining = expYear - currentYear;

    if (yearsRemaining <= 0) {
      setResult(null);
      return;
    }

    // Calculate annual interest payment
    const annualInterest = nominal * interestRate;
    
    // Total interest payments over remaining years
    const totalInterestPayments = annualInterest * yearsRemaining;
    
    // Total return = interest payments + nominal value at expiration
    const totalReturn = totalInterestPayments + nominal;
    
    // Compound rate calculation: CR = (totalReturn / currentValue)^(1/years)
    const compoundRate = Math.pow(totalReturn / current, 1 / yearsRemaining);

    setResult({
      compoundRate,
      totalInterestPayments,
      totalReturn,
      yearsRemaining,
    });
  };

  useEffect(() => {
    calculateCompoundRate();
  }, [bondData]);

  const handleInputChange = (field: keyof BondData, value: string) => {
    setBondData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-financial">
              <Calculator className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Bond Yield Calculator</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Calculate the equivalent compound interest rate for your bond investments
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Bond Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nominal">Nominal Value (€)</Label>
                  <Input
                    id="nominal"
                    type="number"
                    placeholder="e.g., 1000"
                    value={bondData.nominalValue}
                    onChange={(e) => handleInputChange("nominalValue", e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current">Current Value (€)</Label>
                  <Input
                    id="current"
                    type="number"
                    placeholder="e.g., 900"
                    value={bondData.currentValue}
                    onChange={(e) => handleInputChange("currentValue", e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiration">Expiration Year</Label>
                  <Input
                    id="expiration"
                    type="number"
                    placeholder="e.g., 2030"
                    value={bondData.expirationYear}
                    onChange={(e) => handleInputChange("expirationYear", e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest">Yearly Interest Rate (%)</Label>
                  <Input
                    id="interest"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 2.5"
                    value={bondData.yearlyInterestRate}
                    onChange={(e) => handleInputChange("yearlyInterestRate", e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-primary">Calculation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Main Result */}
                  <div className="text-center p-6 bg-gradient-success rounded-lg">
                    <p className="text-sm text-accent-foreground/80 mb-2">Equivalent Compound Rate</p>
                    <p className="text-4xl font-bold text-accent-foreground">
                      {((result.compoundRate - 1) * 100).toFixed(2)}%
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      Annual Yield
                    </Badge>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Years Remaining</span>
                      <span className="font-semibold">{result.yearsRemaining} years</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Total Interest Payments</span>
                      <span className="font-semibold">€{result.totalInterestPayments.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Total Return</span>
                      <span className="font-semibold text-accent">€{result.totalReturn.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Profit</span>
                      <span className="font-semibold text-accent">
                        €{(result.totalReturn - parseFloat(bondData.currentValue)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter bond information to see calculations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Formula Explanation */}
        {result && (
          <Card className="mt-8 shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Calculation Formula</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <p className="mb-2">
                  <strong>Annual Interest:</strong> €{bondData.nominalValue} × {bondData.yearlyInterestRate}% = €{result.totalInterestPayments / result.yearsRemaining}
                </p>
                <p className="mb-2">
                  <strong>Total Interest:</strong> €{(result.totalInterestPayments / result.yearsRemaining).toFixed(2)} × {result.yearsRemaining} years = €{result.totalInterestPayments.toFixed(2)}
                </p>
                <p className="mb-2">
                  <strong>Total Return:</strong> €{result.totalInterestPayments.toFixed(2)} + €{bondData.nominalValue} = €{result.totalReturn.toFixed(2)}
                </p>
                <p>
                  <strong>Compound Rate:</strong> (€{result.totalReturn.toFixed(2)} ÷ €{bondData.currentValue})^(1/{result.yearsRemaining}) = {result.compoundRate.toFixed(4)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BondCalculator;