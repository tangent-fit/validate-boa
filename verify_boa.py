import math

def test_boa(n, constant):
    # Setup Geometry
    theta_start = (0 - n/2) * (2 * math.pi / n)
    theta_end   = (n - n/2) * (2 * math.pi / n)
    
    # Projection & Restoration
    y_start = math.tan(theta_start) * constant
    y_end   = math.tan(theta_end)   * constant
    
    return abs(y_start - y_end)

PSI = 2 / math.pi

print("=== BOA PYTHON VERIFICATION ===")
print(f"{'Scale (N)':<12} | {'Error'}")
print("-" * 30)

for p in range(3, 16, 3):
    n = 10**p
    err = test_boa(n, PSI)
    print(f"10^{p:<9} | {err:.4e}")

print("\n=== UNIQUENESS CHECK ===")
base_err = test_boa(10**9, 1.0)
psi_err = test_boa(10**9, PSI)
print(f"Ratio (BOA / Control): {psi_err / base_err:.5f}")
print(f"Target (2 / pi):       {PSI:.5f}")
